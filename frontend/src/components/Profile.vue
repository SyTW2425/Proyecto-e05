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
            <button @click="showAvatarModal = true"
              class="bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 transition duration-200">
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <div v-else
            class="absolute top-0 right-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button @click="showAvatarModal = true"
              class="bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 transition duration-200">
              <i class="fas fa-pencil-alt"></i>
            </button>
          </div>
        </div>

        <!-- Avatar Modal for Avatar Selection -->
        <div v-if="showAvatarModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div class="bg-gray-800 p-6 rounded-lg w-[600px] max-w-full">
            <h3 class="text-2xl text-yellow-500 mb-6 text-center">Choose Your Profile Picture</h3>
            <div class="overflow-y-auto h-96">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="avatar in avatars" :key="avatar" @click="selectAvatar(avatar)"
                  class="flex justify-center items-center w-28 h-28 p-2 rounded-lg cursor-pointer overflow-hidden transition-transform transform relative group">
                  <img :src="avatar" alt="Avatar"
                    class="object-cover w-full h-full rounded-lg transition-all duration-300 ease-in-out group-hover:scale-110"
                    :class="{
                      'border-4 border-yellow-500 scale-105': userProfilePicture === avatar
                    }" />
                  <div
                    class="absolute inset-0 bg-transparent group-hover:shadow-xl rounded-lg transition-shadow duration-300">
                  </div>
                </div>
              </div>
            </div>
            <button @click="showAvatarModal = false"
              class="bg-yellow-500 text-black py-2 px-4 text-sm rounded-lg hover:bg-yellow-400 transition duration-200 mt-6 w-full sm:w-auto mx-auto block">
              Cancel
            </button>
          </div>
        </div>

        <!-- Follower and Following Stats -->
        <div class="flex justify-between text-sm mt-4">
          <div class="flex flex-col items-center">
            <span class="text-yellow-400 text-lg">{{ followers }}</span>
            <span class="text-gray-400">Followers</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-yellow-400 text-lg">{{ following }}</span>
            <span class="text-gray-400">Following</span>
          </div>
        </div>

        <!-- Profile Details -->
        <h2 class="mt-4 text-lg font-semibold">{{ name }}</h2>
        <p class="text-sm text-gray-400">@{{ userName }}</p>
        <!-- <p class="mt-2 text-sm text-gray-300">
          ✨ Hi, I'm a movie lover! ✨
        </p> -->
      </div>

      <!-- Reviews -->
      <div>
        <h3 class="text-lg text-yellow-500 font-semibold mb-2">Reviews</h3>
        <ul>
          <li v-for="review in reviewStore.reviews" :key="review.id"
            class="flex items-center gap-3 mb-3 cursor-pointer">
            <img :src="review.moviePoster" alt="Movie Poster" class="w-10 h-10 rounded-full object-cover" />
            <div class="flex justify-between w-full">
              <router-link :to="`/movie/${review.movieId}`">
                <h4 class="text-white text-sm hover:opacity-75 transition-opacity duration-200">
                  {{ review.movieTitle }}
                </h4>
              </router-link>
              <button @click="reviewStore.showReviewPopup(review)"
                class="bg-yellow-500 text-black px-3 text-xs rounded-lg hover:bg-yellow-400 transition duration-200">
                Review
              </button>
              <button @click="reviewStore.removeReview(review)"
                class="text-red-500 hover:text-red-400 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg text-yellow-500 font-semibold mt-6 mb-2">Lists</h3>
        <ul>
          <li v-for="list in listsStore.lists" :key="list.id" @click="() => listsStore.showListMovies(list)"
            class="flex items-center gap-3 mb-3 cursor-pointer">
            <div v-if="!list.movies?.length"
              class="w-8 h-8 rounded-full flex justify-center items-center bg-gray-600 text-white">
              <i class="fas fa-list"></i>
            </div>
            <img v-else :src="list.movies[0].moviePoster" alt="List Image" class="w-8 h-8 rounded-full object-cover" />
            <span>{{ list.name }}</span>
            <button @click.stop="listsStore.deleteList(list.id)" class="ml-auto text-red-500 hover:text-red-300">
              <i class="fas fa-trash-alt"></i>
            </button>
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
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-2xl text-yellow-500 mb-4">{{ reviewStore.selectedReview.movieTitle }}</h3>
          <p class="text-white mb-4">Rating: {{ reviewStore.selectedReview.rating }}</p>
          <p class="text-white mb-4">{{ reviewStore.selectedReview.body }}</p>
          <button @click="reviewStore.closeModalReview" class="text-yellow-400 mt-4 hover:underline">Close</button>
        </div>
      </div>

      <!-- Add List Button -->
      <button @click="listsStore.showCreateListModal = true"
        class="bg-yellow-500 text-black px-4 py-2 text-sm rounded-lg hover:bg-yellow-400 transition duration-200 mt-3">
        Create New List
      </button>

      <!-- Modal for creating a new list -->
      <div v-if="listsStore.showCreateListModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-2xl text-yellow-500 mb-4">Create a New List</h3>
          <input v-model="listsStore.newListName" type="text" placeholder="Enter list name"
            class="w-full bg-gray-700 p-3 rounded-lg text-white text-sm mb-4" />
          <div class="flex justify-end gap-4">
            <!-- Cancel Button -->
            <button @click="listsStore.closeModal"
              class="bg-gray-600 text-white py-1 px-3 text-sm rounded-lg hover:bg-gray-500 transition duration-200">
              Cancel
            </button>
            <!-- Create Button -->
            <button @click="listsStore.createList"
              class="bg-yellow-500 text-black py-1 px-3 text-sm rounded-lg hover:bg-yellow-400 transition duration-200">
              Create
            </button>
          </div>
        </div>
      </div>


      <!-- Movie List Modal -->
      <div v-if="listsStore.showMovieListModal && listsStore.selectedListMovies.length > 0"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-2xl text-yellow-500 mb-4">{{ listsStore.selectedList.name }} Movies</h3>
          <ul>
            <li v-for="movie in listsStore.selectedListMovies" :key="movie._id" class="flex items-center gap-3 mb-3">
              <img :src="movie.moviePoster || '/default-movie-poster.jpg'" alt="Movie Poster"
                class="w-10 h-10 rounded-full object-cover" />
              <router-link :to="`/movie/${movie.TMDid}`">
                <span class="flex-1">{{ movie.title }}</span>
              </router-link>
              <button @click.stop="listsStore.deleteMovie(listsStore.selectedList.id, movie._id)"
                class="bg-red-500 text-white py-1 px-3 text-xs rounded-lg hover:bg-red-400 transition duration-200">
                Delete
              </button>
            </li>
          </ul>
          <button @click="listsStore.showMovieListModal = false"
            class="bg-yellow-500 text-black py-1 px-3 text-xs rounded-lg hover:bg-yellow-400 transition duration-200">
            Close
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Feed -->
    <main class="flex-1 p-6">
      <!-- Post Input -->
      <div class="bg-gray-800 p-4 rounded-lg mt-14 mb-6 relative">
        <div class="flex items-center gap-4">
          <img src="/alex.png" alt="User" class="w-12 h-12 rounded-full" />
          <textarea v-model="postContent" placeholder="What's on your mind?"
            class="w-full bg-gray-700 p-3 rounded-lg text-white text-sm resize-none"></textarea>
        </div>

        <div class="flex justify-center items-center mt-3 space-x-4">
          <button
            class="flex items-center gap-2 bg-neutral-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-yellow-500 transition">
            <img src="/camera.svg" class="w-5 h-5" alt="Smiley" />
            Photo
          </button>
          <button
            class="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition">
            <img src="/video.svg" class="w-5 h-5" alt="Video" />
            Video
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useReviewStore } from '../stores/reviewStore';
import { useListStore } from '../stores/listsStore';
import { useUserStore } from '../stores/userStore';
import axios from 'axios';

const userProfilePicture = ref('/default-profile.png');
const showAvatarModal = ref(false);
const postContent = ref('');
const userName = ref('');
const name = ref('');
const email = ref('');
const followers = ref(0);
const following = ref(0);
const profilePicture = ref('/default-profile.png');

const avatars = [
  '/avatars/avatar1.jpg',
  '/avatars/avatar2.jpeg',
  '/avatars/avatar3.jpg',
  '/avatars/avatar4.png',
  '/avatars/avatar5.jpg',
  '/avatars/avatar6.jpeg',
  '/avatars/avatar7.jpeg',
  '/avatars/avatar8.jpg',
  '/avatars/avatar9.png',
  '/avatars/avatar10.jpeg',
  '/avatars/avatar11.jpeg',
  '/avatars/avatar12.jpeg',
  '/avatars/avatar13.jpeg',
];

const reviewStore = useReviewStore();
const listsStore = useListStore();
const userStore = useUserStore();

function selectAvatar(avatar) {
  profilePicture.value = avatar;
  showAvatarModal.value = false;

  updateProfilePicture(avatar);
}


async function updateProfilePicture(newProfilePicture) {
  const userId = localStorage.getItem('userId'); 
  try {
    const response = await axios.put('http://localhost:5001/api/users/profile-picture', {
      userId,
      profilePicture: newProfilePicture,
    });
    userStore.user.profilePicture = response.data.profilePicture;
  } catch (error) {
    console.error('Failed to update profile picture', error);
  }
}

onMounted(async () => {
  const userId = localStorage.getItem('userId');
  await userStore.fetchUser(userId);

  const user = userStore.user;
  userName.value = user.username;
  name.value = user.name;
  email.value = user.email;
  followers.value = user.followers.length;
  following.value = user.following.length;
  profilePicture.value = user.profilePicture;


  reviewStore.fetchReviews();
  listsStore.fetchLists();
});
</script>

<style scoped>
.profile-page {
  padding: 2rem;
}
</style>