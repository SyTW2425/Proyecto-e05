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
          <div class="flex flex-col items-center cursor-pointer" @click="openFollowModal('followers')">
            <span class="text-yellow-400 text-lg">{{ followers }}</span>
            <span class="text-gray-400">Followers</span>
          </div>
          <div class="flex flex-col items-center cursor-pointer" @click="openFollowModal('following')">
            <span class="text-yellow-400 text-lg">{{ following }}</span>
            <span class="text-gray-400">Following</span>
          </div>
        </div>


        <div v-if="showFollowModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div class="bg-gray-800 p-6 rounded-lg w-[600px] max-w-full">
            <h3 class="text-2xl text-yellow-500 mb-4 text-center">{{ followModalTitle }}</h3>
            <div class="overflow-y-auto max-h-96">
              <ul>
                <li v-for="user in followUsers" :key="user._id" class="flex items-center gap-3 mb-3 cursor-pointer">
                  <img :src="user.profilePicture || '/default-profile.png'" alt="User Avatar"
                    class="w-12 h-12 rounded-full object-cover" />
                  <div class="text-left">
                    <h2 class="text-lg font-semibold text-yellow-500 cursor-pointer hover:underline"
                      @click="openUserInfoModal(user._id)">
                      {{ user.name }}
                    </h2>
                    <p class="text-sm text-gray-400">@{{ user.username }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <button @click="closeFollowModal"
              class="bg-yellow-500 text-black py-2 px-4 text-sm rounded-lg hover:bg-yellow-400 transition duration-200 mt-6 w-full sm:w-auto mx-auto block">
              Close
            </button>
          </div>
        </div>

        <div v-if="showUserInfoModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div class="bg-gray-800 p-6 rounded-lg w-[500px] max-w-full">
            <h3 class="text-2xl text-yellow-500 mb-4 text-center">User Details</h3>
            <div class="flex flex-col items-center">
              <img :src="selectedUser.profilePicture || '/default-profile.png'" alt="User Avatar"
                class="w-24 h-24 rounded-full object-cover mb-4" />
              <h2 class="text-xl font-semibold">{{ selectedUser.name }}</h2>
              <p class="text-sm text-gray-400">@{{ selectedUser.username }}</p>
              <p class="mt-2 text-gray-300">{{ selectedUser.bio || 'No bio available.' }}</p>
            </div>
            <button @click="closeUserInfoModal"
              class="bg-yellow-500 text-black py-2 px-4 text-sm rounded-lg hover:bg-yellow-400 transition duration-200 mt-6 w-full sm:w-auto mx-auto block">
              Close
            </button>
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
          <li v-for="review in reviewStore.reviews" :key="review.id"
            class="flex items-center gap-3 mb-3 cursor-pointer">
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
                <button @click="reviewStore.removeReview(review)"
                  class="text-red-500 hover:text-red-400 transition duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
          <li v-for="list in listsStore.lists" :key="list.id" @click="() => listsStore.showListMovies(list)"
            class="flex items-center gap-3 mb-3 cursor-pointer">
            <!-- Placeholder or image -->
            <div v-if="!list.movies?.length"
              class="w-8 h-8 rounded-full flex justify-center items-center bg-gray-600 text-white">
              <i class="fas fa-list"></i>
            </div>
            <img v-else :src="list.movies[0].moviePoster" alt="List Image" class="w-8 h-8 rounded-full object-cover" />
            <!-- List name -->
            <span>{{ list.name }}</span>
            <!-- Delete button -->
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


      <!-- Add List Button -->
      <button @click="listsStore.showCreateListModal = true"
        class="bg-yellow-500 text-black px-4 py-2 text-sm rounded-lg hover:bg-yellow-400 transition duration-200 mt-3">
        Create New List
      </button>

      <!-- Modal for creating a new list -->
      <div v-if="listsStore.showCreateListModal"
        class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div
          class="bg-gray-900 p-8 rounded-lg max-w-md w-full shadow-xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
          <!-- Modal Header -->
          <h3 class="text-3xl text-yellow-500 font-semibold mb-6 text-center">Create a New List</h3>

          <!-- Input Field -->
          <input v-model="listsStore.newListName" type="text" placeholder="Enter list name"
            class="w-full bg-gray-800 p-3 rounded-lg text-white text-base mb-6 focus:ring-2 focus:ring-yellow-500 outline-none transition-all duration-200" />

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4">
            <!-- Cancel Button -->
            <button @click="listsStore.closeModal"
              class="bg-gray-700 text-white py-2 px-5 rounded-full text-base hover:bg-gray-600 transition-all duration-200 focus:outline-none">
              Cancel
            </button>

            <!-- Create Button -->
            <button @click="listsStore.createList"
              class="bg-yellow-500 text-black py-2 px-5 rounded-full text-base font-semibold hover:bg-yellow-400 transition-all duration-200 focus:outline-none">
              Create
            </button>
          </div>
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
              <button @click.stop="listsStore.deleteMovie(listsStore.selectedList.id, movie._id)"
                class="bg-red-500 text-white py-1 px-3 text-xs rounded-lg hover:bg-red-400 transition duration-200 focus:outline-none">
                Delete
              </button>
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
      <section class="space-y-6 mt-8">
        <div v-for="activity in userStore.activities" :key="activity.id"
          class="p-6 rounded-lg shadow-lg flex gap-4 items-start relative"
          :class="activity.isCurrentUser ? 'bg-yellow-800' : 'bg-gray-900'">
          <img :src="activity.userProfilePicture" alt="User" class="w-10 h-10 rounded-full object-cover" />
          <div>
            <p class="text-white text-sm">
              <span class="font-semibold text-yellow-400">{{ activity.username }}</span>
              <template v-if="activity.type === 'review'">
                reviewed and rated <span class="font-semibold text-yellow-400">{{ activity.review.movie.title }}</span>
                <span class="text-yellow-500 font-bold"> ({{ activity.review.rating }}/10)</span>
              </template>
              <template v-else-if="activity.type === 'add_to_list'">
                added <span class="font-semibold text-yellow-400">{{ activity.movieName }}</span>
                to the list <span class="font-semibold text-yellow-400">{{ activity.list.name }}</span> the film <span
                  class="font-semibold text-yellow-400">{{ activity.movie.title }}</span>.
              </template>
              <template v-else-if="activity.type === 'follow'">
                followed <span class="font-semibold text-yellow-400">{{ activity.followed.name }}</span>.
              </template>
            </p>
            <p v-if="activity.type === 'review'" class="text-gray-400 text-sm mt-2 italic">
              "{{ activity.review.body }}"
            </p>
          </div>
          <!-- Date added in the bottom-right corner -->
          <span class="absolute bottom-2 right-2 text-xs text-gray-400">
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

async function openFollowModal(type) {
  showFollowModal.value = true;
  followModalTitle.value = type === 'followers' ? 'Followers' : 'Following';

  const userId = localStorage.getItem('userId');
  try {
    const endpoint =
      type === 'followers'
        ? `http://localhost:5001/api/users/followers/${userId}`
        : `http://localhost:5001/api/users/following/${userId}`;
    const response = await axios.get(endpoint);

    // Fetch detailed user info for each user
    followUsers.value = await Promise.all(
      response.data.map(async (user) => {
        const userInfo = await userStore.fetchUserInfo(user._id);
        return userInfo;
      })
    );

  } catch (error) {
    console.error('Failed to fetch users', error);
  }
}


async function openUserInfoModal(userId) {
  try {
    const userInfo = await userStore.fetchUserInfo(userId);
    selectedUser.value = userInfo; // Store the user's information
    showUserInfoModal.value = true; // Open the modal
  } catch (error) {
    console.error('Failed to fetch user information', error);
  }
}

function closeUserInfoModal() {
  showUserInfoModal.value = false;
  selectedUser.value = null;
}

function closeFollowModal() {
  showFollowModal.value = false;
  followUsers.value = [];
}

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

const activities = ref([]); // Keep this reactive

const reviewStore = useReviewStore();
const listsStore = useListStore();
const userStore = useUserStore();

watch(() => userStore.searchQuery, () => {
  userStore.searchUsers();
});

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

  userStore.fetchUsers();

  userStore.fetchActivities();
});


</script>

<style scoped>
.profile-page {
  padding: 2rem;
}
</style>