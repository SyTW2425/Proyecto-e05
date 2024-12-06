<template>
  <div class="min-h-screen bg-gray-900 text-white flex font-[poppins]">
    <!-- Sidebar -->
    <aside class="w-72 bg-gray-800 p-6 mt-20 flex flex-col gap-8">

      <!-- Profile Section -->
      <div class="bg-gray-700 p-6 rounded-lg text-center relative overflow-hidden">
        <!-- Background Image -->
        <div class="absolute top-0 left-0 w-full h-20 bg-cover bg-center"
          style="background-image: url('/background-pattern.png');"></div>

        <!-- Profile Picture -->
        <div class="relative w-24 h-24 mx-auto flex justify-center items-center mt-8">
          <img src="/alex.png" alt="User" class="rounded-lg border-2 border-yellow-400" />
        </div>

        <!-- Follower and Following Stats -->
        <div class="flex justify-between text-sm mt-4">
          <div class="flex flex-col items-center">
            <span class="text-yellow-400 text-lg">1984</span>
            <span class="text-gray-400">Followers</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-yellow-400 text-lg">1002</span>
            <span class="text-gray-400">Following</span>
          </div>
        </div>

        <!-- Profile Details -->
        <h2 class="mt-4 text-lg font-semibold">AlExMDi</h2>
        <p class="text-sm text-gray-400">@alexmdi</p>
        <p class="mt-2 text-sm text-gray-300">
          ✨ Hi, I'm a movie lover! ✨
        </p>
      </div>

      <!-- Reviews -->
      <div>
        <h3 class="text-sm text-yellow-500 font-semibold mb-2">Reviews</h3>
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


      <!-- Full Review Pop-up -->
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

      <!-- Lists -->
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
            class="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition">
            <img src="/video.svg" class="w-5 h-5" />
            Video
          </button>
          <button
            class="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition">
            <img src="/poll.svg" class="w-5 h-5" />
            Poll
          </button>
        </div>

        <div class="absolute right-4 bottom-4">
          <button class="bg-yellow-400 px-6 py-2 text-black rounded-lg">
            Post
          </button>
        </div>
      </div>

      <!-- Posts -->
      <div v-for="post in posts" :key="post.id" class="bg-gray-800 p-4 rounded-lg mb-6">
        <div class="flex items-center gap-4 mb-4">
          <img :src="post.userImage" alt="User" class="w-12 h-12 rounded-full" />
          <div>
            <h3 class="font-semibold">{{ post.userName }}</h3>
            <p class="text-sm text-gray-400">{{ post.time }}</p>
          </div>
        </div>
        <p class="text-gray-300">{{ post.content }}</p>
        <img v-if="post.image" :src="post.image" alt="Post" class="mt-4 rounded-lg" />
        <div class="flex items-center gap-8 text-gray-500 mt-4">
          <span>❤️ {{ post.likes }}</span>
          <span>💬 {{ post.comments }}</span>
          <span>🔄 {{ post.shares }}</span>
        </div>
      </div>
    </main>

    <!-- Right Sidebar -->
    <aside class="w-72 bg-gray-800 p-6 mt-20 flex flex-col gap-8">
      <!-- Recent Activity -->
      <div>
        <h3 class="text-lg font-semibold mb-4">My Activity</h3>
        <ul class="space-y-4">
          <li v-for="activity in activities" :key="activity.id" class="bg-gray-700 p-4 rounded-lg flex flex-col">
            <div>
              <p class="text-sm font-semibold">{{ activity.name }}</p>
              <p class="text-sm text-gray-400">{{ activity.time }}</p>
            </div>
            <!-- Move action text below the user info -->
            <p class="text-sm text-yellow-400 mt-2">
              {{ activity.action }}
            </p>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useListStore } from "../stores/listsStore";
import { useReviewStore } from "../stores/reviewStore";
import router from "../router";

const reviewStore = useReviewStore();
const listsStore = useListStore();

onMounted(() => {
  reviewStore.fetchReviews();
  listsStore.fetchLists();
});
</script>

<style scoped>
textarea {
  word-wrap: break-word;
  word-break: break-word;
  resize: none;
}
</style>
