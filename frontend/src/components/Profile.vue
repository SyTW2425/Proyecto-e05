<template>
  <div class="bg-custom-background min-h-screen p-8">
    <!-- Profile Card -->
    <div class="max-w-4xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105">
      <div class="flex items-center gap-8">
        <!-- User Photo -->
        <div class="relative">
          <img
            :src="user.photoUrl || '../src/assets/profile-user.png'"
            alt="User Photo"
            class="w-36 h-36 rounded-full object-cover border-4 border-yellow-500 transition-transform transform hover:scale-105"
          />
          <button
            @click="changeProfilePhoto"
            class="absolute bottom-0 right-0 bg-yellow-500 text-black p-3 rounded-full transform translate-x-2 translate-y-2 hover:bg-yellow-600 transition"
          >
            <i class="fas fa-camera"></i> <!-- You can replace with an icon -->
          </button>
        </div>
        <div class="text-white">
          <h1 class="text-4xl font-extrabold tracking-tight">{{ user.username }}</h1>
          <p class="text-gray-400 text-lg">{{ user.email }}</p>
          <div class="mt-4 flex gap-8 text-lg text-gray-300">
            <div>
              <strong>{{ user.followingCount }}</strong> Following
            </div>
            <div>
              <strong>{{ user.followersCount }}</strong> Followers
            </div>
          </div>
        </div>
      </div>

      <!-- Share Profile Button -->
      <div class="mt-6 flex justify-center">
        <button
          @click="shareProfile"
          class="px-8 py-3 rounded-xl bg-yellow-500 text-black font-semibold text-lg hover:bg-yellow-600 transition-all duration-300"
        >
          Share via Email
        </button>
      </div>
    </div>

    <div class="mt-12">
      <h2 class="text-3xl text-white font-semibold mb-6">My Lists</h2>
      <div v-if="user.lists.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="list in user.lists"
          :key="list.id"
          class="bg-gray-700 p-6 rounded-xl cursor-pointer hover:scale-105 transition-all duration-300"
          @click="goToList(list.id)"
        >
          <h3 class="text-xl text-yellow-400">{{ list.name }}</h3>
          <p class="text-gray-400">{{ list.description || 'No description available' }}</p>
        </div>
      </div>
      <div v-else class="text-center text-gray-400">You haven't created any lists yet.</div>
    </div>

    <!-- Following Section -->
    <div v-if="user.following.length" class="mt-12">
      <h2 class="text-3xl text-white font-semibold mb-6">Following</h2>
      <input
        v-model="searchFollowing"
        type="text"
        placeholder="Search for a friend..."
        class="w-full max-w-xs p-3 mb-6 rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
      />
      <div v-if="filteredFollowing.length > 0" class="carousel-container overflow-x-auto flex space-x-6 py-6">
        <div
          v-for="user in filteredFollowing"
          :key="user.id"
          class="bg-gray-700 p-6 rounded-xl hover:scale-105 transition-all duration-300 w-60"
        >
          <img :src="user.photoUrl || '../src/assets/profile-user.png'" class="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-4 border-yellow-500" />
          <h3 class="text-yellow-400 text-center text-xl font-semibold">{{ user.username }}</h3>
          <button
            @click="toggleFollow(user)"
            :class="user.isFollowing ? 'bg-red-400' : 'bg-yellow-500'"
            class="mt-4 px-6 py-3 rounded-full text-black font-medium hover:bg-yellow-600 transition-all duration-300 block mx-auto"
          >
            {{ user.isFollowing ? 'Unfollow' : 'Follow' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Followers Section -->
    <div v-if="user.followers.length" class="mt-12">
      <h2 class="text-3xl text-white font-semibold mb-6">Followers</h2>
      <input
        v-model="searchFollowers"
        type="text"
        placeholder="Search for a friend..."
        class="w-full max-w-xs p-3 mb-6 rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
      />
      <div v-if="filteredFollowers.length > 0" class="carousel-container overflow-x-auto flex space-x-6 py-6">
        <div
          v-for="user in filteredFollowers"
          :key="user.id"
          class="bg-gray-700 p-6 rounded-xl hover:scale-105 transition-all duration-300 w-60"
        >
          <img :src="user.photoUrl || '../src/assets/profile-user.png'" class="w-24 h-24 rounded-full object-cover mb-4 mx-auto border-4 border-yellow-500" />
          <h3 class="text-yellow-400 text-center text-xl font-semibold">{{ user.username }}</h3>
          <button
            @click="toggleFollow(user)"
            :class="user.isFollowing ? 'bg-red-400' : 'bg-yellow-500'"
            class="mt-4 px-6 py-3 rounded-full text-black font-medium hover:bg-yellow-600 transition-all duration-300 block mx-auto"
          >
            {{ user.isFollowing ? 'Unfollow' : 'Follow' }}
          </button>
        </div>
      </div>
    </div>

    <!-- User Lists Section -->
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface User {
  username: string;
  email: string;
  photoUrl: string | null;
  followingCount: number;
  followersCount: number;
  following: { id: number; username: string; photoUrl: string | null, isFollowing: boolean }[];
  followers: { id: number; username: string; photoUrl: string | null, isFollowing: boolean }[];
  lists: { id: number; name: string; description?: string }[];
}

export default defineComponent({
  name: "UserProfile",
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
        ],
      } as User,
      searchFollowing: "",
      searchFollowers: "",
    };
  },
  computed: {
    filteredFollowing() {
      return this.user.following.filter(user =>
        user.username.toLowerCase().includes(this.searchFollowing.toLowerCase())
      );
    },
    filteredFollowers() {
      return this.user.followers.filter(user =>
        user.username.toLowerCase().includes(this.searchFollowers.toLowerCase())
      );
    },
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
    toggleFollow(user: { id: number; isFollowing: boolean }) {
      user.isFollowing = !user.isFollowing;
    },
    goToList(listId: number) {
      // Navigate to the list details page
    },
  },
});
</script>

<style scoped>
.bg-custom-background {
  background-image: linear-gradient(to right, #0b101a, #1a2b3f);
  background-size: cover;
  background-position: center;
}
</style>