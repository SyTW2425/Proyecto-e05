<template>
  <div class="bg-custom-background min-h-screen p-8 mt-10">
    <!-- Profile Card -->
    <div
      class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-3xl shadow-2xl transform transition-transform hover:scale-105">
      <div class="flex items-center gap-10">
        <!-- User Photo -->
        <div class="relative flex-shrink-0">
          <img :src="user.photoUrl || '../src/assets/profile-user.png'" alt="User Photo"
            class="w-40 h-40 rounded-full object-cover border-4 border-yellow-500 transition-transform hover:scale-110" />
          <button @click="changeProfilePhoto"
            class="absolute bottom-0 right-0 bg-yellow-500 text-black p-3 rounded-full transform translate-x-2 translate-y-2 hover:bg-yellow-600 transition duration-300">
            <i class="fas fa-camera text-lg"></i>
          </button>
        </div>
        <!-- User Info -->
        <div class="text-white flex-1">
          <h1 class="text-5xl font-extrabold tracking-tight">{{ user.username }}</h1>
          <p class="text-gray-400 text-xl mt-2">{{ user.email }}</p>
          <div class="mt-6 flex gap-12 text-lg text-gray-300">
            <div>
              <strong class="text-yellow-400">{{ user.followingCount }}</strong> Following
            </div>
            <div>
              <strong class="text-yellow-400">{{ user.followersCount }}</strong> Followers
            </div>
          </div>
        </div>
      </div>

      <!-- Share Profile Button -->
      <div class="mt-8 flex justify-center">
        <button @click="shareProfile"
          class="px-8 py-4 rounded-full bg-yellow-500 text-black font-semibold text-xl hover:bg-yellow-600 transition duration-300">
          Share Profile
        </button>
      </div>
    </div>

    <!-- My Lists -->
    <section class="mt-12">
      <h2 class="text-4xl text-white font-semibold mb-8">My Lists</h2>
      <div v-if="user.lists.length > 0" class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="list in user.lists" :key="list.id"
          :class="['relative bg-gray-700 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform cursor-pointer', { 'delete-item': list.deleted }]"
          @click="goToList(list.id)">
          <h3 class="text-xl font-semibold text-yellow-400">{{ list.name }}</h3>
          <p class="text-gray-400 mt-2">{{ list.description || "No description available" }}</p>
          <div class="absolute bottom-4 right-4">
            <DeleteItem :itemId="list.id" :deleteAction="onItemDeleted" />
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-400 mt-4">You haven't created any lists yet.</div>
    </section>

    <!-- My Reviews -->
    <section class="mt-12">
      <h2 class="text-4xl text-white font-semibold mb-8">My Reviews</h2>
      <div v-if="user.reviews.length > 0" class="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="review in user.reviews" :key="review.id"
          class="relative bg-gray-700 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform">
          <h3 class="text-xl font-semibold text-yellow-400">{{ review.movieTitle }}</h3>
          <p class="text-gray-400 mt-2">{{ review.content }}</p>
          <div class="text-yellow-300 mt-4">Rating: {{ review.rating }} / 5</div>
          <div class="absolute bottom-4 right-4">
            <DeleteItem :itemId="review.id" :deleteAction="onItemDeleted" />
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-400 mt-4">You haven't written any reviews yet.</div>
    </section>

    <!-- Following and Followers Section -->
    <section class="mt-12">
      <h2 class="text-4xl text-white font-semibold mb-8">Following & Followers</h2>

      <!-- Following List -->
      <div class="mb-8">
        <h3 class="text-2xl font-semibold text-yellow-400 mb-6">Following</h3>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="person in user.following" :key="person.id"
            class="flex items-center space-x-6 bg-gray-700 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform">
            <img :src="person.photoUrl || '../src/assets/profile-user.png'" alt="Person Photo"
              class="w-16 h-16 rounded-full object-cover" />
            <div class="text-white">
              <h4 class="text-lg font-semibold">{{ person.username }}</h4>
              <button @click="toggleFollow(person)"
                class="text-yellow-400 hover:text-yellow-500 transition duration-300">
                {{ person.isFollowing ? 'Unfollow' : 'Follow' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Followers List -->
      <div>
        <h3 class="text-2xl font-semibold text-yellow-400 mb-6">Followers</h3>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="person in user.followers" :key="person.id"
            class="flex items-center space-x-6 bg-gray-700 p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform">
            <img :src="person.photoUrl || '../src/assets/profile-user.png'" alt="Person Photo"
              class="w-16 h-16 rounded-full object-cover" />
            <div class="text-white">
              <h4 class="text-lg font-semibold">{{ person.username }}</h4>
              <button @click="toggleFollow(person)"
                class="text-yellow-400 hover:text-yellow-500 transition duration-300">
                {{ person.isFollowing ? 'Unfollow' : 'Follow' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeleteItem from "./DeleteItem.vue";

interface List {
  id: number;
  name: string;
  description?: string;
  deleted?: boolean; // Optional deleted property
}

interface Review {
  id: number;
  movieTitle: string;
  content: string;
  rating: number;
  deleted?: boolean; // Optional deleted property
}

interface User {
  username: string;
  email: string;
  photoUrl: string | null;
  followingCount: number;
  followersCount: number;
  following: { id: number; username: string; photoUrl: string | null, isFollowing: boolean }[];
  followers: { id: number; username: string; photoUrl: string | null, isFollowing: boolean }[];
  lists: List[];
  reviews: Review[];
}

export default defineComponent({
  name: "UserProfile",
  components: {
    DeleteItem,
  },
  data() {
    return {
      user: {
        username: "JohnDoe",
        email: "john.doe@example.com",
        photoUrl: null,
        followingCount: 123,
        followersCount: 456,
        following: [
          { id: 1, username: "Alex", photoUrl: '../src/assets/alex.png', isFollowing: true },
          { id: 2, username: "Dani", photoUrl: '../src/assets/dani.png', isFollowing: false },
        ],
        followers: [
          { id: 3, username: "David", photoUrl: '../src/assets/david.png', isFollowing: false },
          { id: 4, username: "Lucas", photoUrl: '../src/assets/lucas.png', isFollowing: true },
        ],
        lists: [
          { id: 1, name: "My Favorite Movies", description: "A list of my all-time favorite movies" },
          { id: 2, name: "Must-Watch Films", description: "Movies I still need to watch" },
          { id: 3, name: "Oscar Winners", description: "Oscar-winning movies worth watching" },
        ],
        reviews: [
          { id: 1, movieTitle: "Inception", content: "A masterpiece of sci-fi storytelling!", rating: 5 },
          { id: 2, movieTitle: "Interstellar", content: "Visually stunning with a touching story.", rating: 4.5 },
          { id: 3, movieTitle: "The Dark Knight", content: "Unforgettable performances and thrilling action.", rating: 5 },
        ],
      } as User,
    };
  },
  methods: {
    shareProfile() {
      const subject = "Check out my movie profile!";
      const body = `Hi, check out my movie profile: ${window.location.href}`;
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    },
    changeProfilePhoto() {
      // Trigger profile photo change logic (e.g., open file picker)
    },
    goToList(listId: number) {
      // alert(`Navigating to list with ID: ${listId}`);
    },
    onItemDeleted(itemId: number) {

    },
    deleteList(listId: number) {
      this.user.lists = this.user.lists.filter((list) => list.id !== listId);
    },
    deleteReview(reviewId: number) {
      this.user.reviews = this.user.reviews.filter((review) => review.id !== reviewId);
    },
    toggleFollow(person: { id: number; username: string; isFollowing: boolean }) {
      person.isFollowing = !person.isFollowing; // Toggle follow state
    },
  },
});
</script>

<style scoped>
/* Apply the animation when item is deleted */
.delete-item {
  animation: fadeOut 0.5s forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>