<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row font-[poppins]">
    <!-- Sidebar -->
    <aside class="w-full md:w-72 bg-gray-800 p-6 mt-20 flex flex-col gap-8 overflow-auto max-h-screen">

      <!-- Profile Section -->
      <div class="bg-gray-700 p-6 rounded-lg text-center relative overflow-hidden">
        <!-- Background Image -->
        <div class="absolute top-0 left-0 w-full h-20 bg-cover bg-center"
          :style="{ backgroundImage: 'url(/background-pattern.png)' }"></div>

        <!-- Profile Picture -->
        <div class="relative w-24 h-24 mx-auto flex justify-center items-center mt-8 group">
          <img :src="profilePicture" alt="User"
            class="w-full h-full object-cover rounded-full border-2 border-yellow-400" />
          <!-- Hover Button (edit profile picture) -->
          <div v-if="profilePicture === '/default-profile.png'"
            class="absolute top-0 right-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">

          </div>
        </div>


        <!-- Follower and Following Stats -->
        <div class="flex justify-between text-sm mt-4">
          <div class="flex flex-col items-center cursor-pointer">
            <span class="text-yellow-400 text-lg">{{ followers }}</span>
            <span class="text-gray-400">Followers</span>
          </div>
          <div class="flex flex-col items-center cursor-pointer">
            <span class="text-yellow-400 text-lg">{{ following }}</span>
            <span class="text-gray-400">Following</span>
          </div>
        </div>



        <!-- Profile Details -->
        <h2 class="mt-4 text-lg font-semibold">{{ name }}</h2>
        <p class="text-sm left-0 text-gray-400">@{{ userName }}</p>
      </div>

      <!-- Reviews -->
      <div>
        <h3 class="text-lg text-yellow-500 font-semibold mb-2">Reviews</h3>
        <ul>
          <li v-for="review in reviews" :key="review.id" class="flex items-center gap-3 mb-3 cursor-pointer">
            <img :src="review.moviePoster" alt="Movie Poster" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex items-center justify-between w-full">
              <router-link :to="`/movie/${review.movieId}`" class="flex-1 truncate">
                <h4 class="text-white text-sm hover:opacity-75 transition-opacity duration-200 truncate">
                  {{ reviewStore.truncateTitle(review.movieTitle, 10) }}
                </h4>
              </router-link>
              <div class="flex items-center gap-2">
                <button @click="reviewStore.showReviewPopup(review)"
                  class="bg-yellow-500 text-black px-3 py-1 text-xs rounded-lg hover:bg-yellow-400 transition duration-200 w-20 text-center">
                  Review
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg text-yellow-500 font-semibold mt-6 mb-2">Lists</h3>
        <!-- Scrollable container -->
        <ul class="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200">
          <li v-for="list in lists" :key="list.id" @click="() => listsStore.showListMovies(list)"
            class="flex items-center gap-3 mb-3 cursor-pointer">
            <!-- Placeholder or image -->
            <div v-if="!list.movies?.length"
              class="w-8 h-8 rounded-full flex justify-center items-center bg-gray-600 text-white">
              <i class="fas fa-list"></i>
            </div>
            <img v-else :src="list.movies[0].moviePoster" alt="List Image" class="w-8 h-8 rounded-full object-cover" />
            <!-- List name -->
            <span>{{ list.name }}</span>
          </li>
        </ul>
      </div>



      <div v-if="reviewStore.showReviewModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-xl text-yellow-500 mb-4">{{ reviewStore.selectedReview.movieTitle }}</h3>
          <p class="text-white text-sm mb-4">Rating: {{ reviewStore.selectedReview.rating }}</p>
          <p class="text-white text-sm mb-4">{{ reviewStore.selectedReview.body }}</p>
          <button @click="reviewStore.closeModalReview"
            class="bg-yellow-500 text-black py-1 px-3 text-xs rounded-lg hover:bg-yellow-400 transition duration-200">
            Close
          </button>
        </div>
      </div>

      <!-- Full Review Pop-up -->
      <div v-if="reviewStore.showModalReview"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-2xl text-yellow-500 mb-4">{{ reviewStore.selectedReview.movieTitle }}</h3>
          <p class="text-white mb-4">Rating: {{ reviewStore.selectedReview.rating }}</p>
          <p class="text-white mb-4">{{ reviewStore.selectedReview.body }}</p>
          <button @click="reviewStore.closeModalReview"
            class="bg-yellow-500 text-black py-2 px-4 rounded-lg hover:bg-yellow-400 transition duration-200">
            Close
          </button>
        </div>
      </div>

      <!-- Full Review Pop-up -->
      <div v-if="reviewStore.showModalReview"
        class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div
          class="bg-gray-900 p-8 rounded-lg max-w-md w-full shadow-xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
          <h3 class="text-3xl text-yellow-500 font-semibold mb-4">{{ reviewStore.selectedReview.movieTitle }}</h3>
          <p class="text-lg text-white mb-2">Rating:
            <span class="font-semibold text-yellow-400">{{ reviewStore.selectedReview.rating }}</span>
          </p>
          <p class="text-white mb-6">{{ reviewStore.selectedReview.body }}</p>

          <button @click="reviewStore.closeModalReview"
            class="bg-yellow-500 text-black py-2 px-6 rounded-full text-lg hover:bg-yellow-400 transition-all duration-200 focus:outline-none">
            Close
          </button>
        </div>
      </div>


      <!-- Movie List Modal -->
      <div v-if="listsStore.showMovieListModal && listsStore.selectedListMovies.length > 0"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div
          class="bg-gray-900 p-8 rounded-lg w-96 max-w-md shadow-lg transform transition-all duration-300 ease-in-out translate-x-12">
          <h3 class="text-2xl text-yellow-400 mb-4 font-semibold">{{ listsStore.selectedList.name }} Movies</h3>
          <ul
            class="max-h-96 overflow-y-scroll space-y-4 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-700 scrollbar-rounded-lg">
            <li v-for="movie in listsStore.selectedListMovies" :key="movie._id"
              class="flex items-center gap-3 mb-3 hover:bg-gray-800 rounded-lg transition duration-200">
              <img :src="movie.moviePoster || '/default-movie-poster.jpg'" alt="Movie Poster"
                class="w-12 h-12 rounded-full object-cover shadow-md" />
              <router-link :to="`/movie/${movie.TMDid}`"
                class="flex-1 text-white hover:text-yellow-400 transition duration-200">
                <span class="font-medium">{{ movie.title }}</span>
              </router-link>
            </li>
          </ul>
          <button @click="listsStore.showMovieListModal = false"
            class="bg-yellow-500 text-black py-1 px-4 text-sm rounded-lg hover:bg-yellow-400 transition duration-200 focus:outline-none mt-2">
            Close
          </button>
        </div>
      </div>

    </aside>

    <!-- Main Feed -->
    <main class="flex-1 p-6 space-y-8">
      <!-- Activity Feed -->
      <section class="space-y-6 mt-10">
        <div v-for="activity in activities" :key="activity._id"
          class="p-6 rounded-lg shadow-lg flex gap-4 items-start relative transition-transform transform hover:scale-105"
          :class="activity.isCurrentUser ? 'bg-yellow-800' : 'bg-gray-900'">

          <!-- Profile Picture with subtle hover effect -->
          <div class="relative group">
            <img :src="activity.userProfilePicture" alt="User"
              class="w-12 h-12 rounded-full object-cover shadow-md transition-all duration-300 ease-in-out group-hover:ring-2 group-hover:ring-yellow-500" />
          </div>

          <div class="flex flex-col justify-start gap-2">
            <p class="text-white text-sm">
              <span class="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors duration-300">{{
                activity.username }}</span>

              <!-- Review activity -->
              <template v-if="activity.type === 'review'">
                <span class="text-gray-300"> reviewed and rated </span>
                <!-- Movie Icon for review activity -->
                <i class="fas fa-film text-yellow-400 mx-1"></i>
                <router-link :to="`/movie/${activity.review.movie.TMDid}`"
                  class="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
                  {{ activity.review.movie.title }}
                </router-link>
                <span class="text-yellow-500 font-bold"> ({{ activity.review.rating }}/10)</span>
              </template>

              <!-- Add to list activity -->
              <template v-else-if="activity.type === 'add_to_list'">
                <span class="text-gray-300"> added </span>
                <!-- Plus Icon for add to list activity -->
                <i class="fas fa-plus-circle text-yellow-400 mx-1"></i>
                <span class="font-semibold text-yellow-400">{{ activity.movieName }}</span>
                <span class="text-gray-300"> to the list </span>
                <span class="font-semibold text-yellow-400">{{ activity.list.name }}</span>
                <span class="text-gray-300"> the film </span>
                <router-link :to="`/movie/${activity.movie.TMDid}`"
                  class="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
                  {{ activity.movie.title }}
                </router-link>.
              </template>

              <!-- Follow activity -->
              <template v-else-if="activity.type === 'follow'">
                <span class="text-gray-300"> followed </span>
                <!-- Follow Icon for follow activity -->
                <i class="fas fa-user-plus text-yellow-400 mx-1"></i>
                <span class="font-semibold text-yellow-400">{{ activity.followed.name }}</span>.
              </template>
            </p>

            <!-- Review body text -->
            <p v-if="activity.type === 'review'" class="text-gray-400 text-sm mt-2 italic">
              "{{ activity.review.body }}"
            </p>
          </div>

          <!-- Date in the bottom-right corner -->
          <span class="absolute bottom-2 right-2 text-xs text-gray-400 opacity-70">
            {{ new Date(activity.createdAt).toLocaleString().split(',')[0] }}
          </span>
        </div>
      </section>
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useReviewStore } from '../stores/reviewStore';
import { useListStore } from '../stores/listsStore';
import { useUserStore } from '../stores/userStore';
import axios from 'axios';

const userProfilePicture = ref('/default-profile.png');
const showUserInfoModal = ref(false);
const showAvatarModal = ref(false);
const postContent = ref('');
const userName = ref('');
const selectedUser = ref(null); // To store the selected user's information
const name = ref('');
const email = ref('');
const followers = ref(0);
const following = ref(0);
const profilePicture = ref('/default-profile.png');
const showFollowModal = ref(false);
const followModalTitle = ref('');
const followUsers = ref([]);

const activities = ref([]); // Keep this reactive
const reviews = ref([]); // Keep this reactive
const lists = ref([]); // Keep this reactive

const reviewStore = useReviewStore();
const listsStore = useListStore();
const userStore = useUserStore();

// Get username from the URL path
const username = window.location.pathname.split('/')[2];
const userId = ref('');

// Get user based on the username
const getUser = async () => {
  try {
    const loggedInUserId = localStorage.getItem('userId'); // This is the logged-in user ID (from localStorage)
    const username = window.location.pathname.split('/')[2]; // The friend's username (from URL)

    if (!loggedInUserId || !username) {
      console.error('No userId or username found');
      return;
    }

    // Fetch the friend’s data using their username
    const response = await axios.get(`http://localhost:5001/api/users/user/${username}`);
    const friend = response.data.user;

    // Store the friend’s data without affecting the logged-in user’s state
    selectedUser.value = friend;

    userId.value = loggedInUserId;
    await userStore.fetchUser(userId.value); // Fetch data for the logged-in user
    const user = userStore.user;

    // Display the friend’s data
    userName.value = friend.username;
    name.value = friend.name;
    followers.value = friend.followers.length;
    following.value = friend.following.length;
    profilePicture.value = friend.profilePicture;

    // Fetch friend-specific data
    reviews.value = await reviewStore.fetchUserReviews(friend._id); // friend's userId for data
    lists.value = await listsStore.fetchUserLists(friend._id); // friend's userId
    activities.value = await userStore.fetchUserActivities(friend._id); // friend's userId for activities

  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};


onMounted(async () => {
  await getUser(); // Call getUser when the component mounts
});
</script>


<style scoped>
.profile-page {
  padding: 2rem;
}
</style>