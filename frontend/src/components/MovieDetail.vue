<template>
  <Navbar />
  <div class="mt-10 bg-custom-background font-[poppins]">
    <!-- Background Image -->
    <div v-if="movieDetailStore.movie" class="absolute inset-0 w-full h-[570px] bg-cover bg-center"
      :style="movieDetailStore.movieBackgroundStyle"></div>
    <div v-if="movieDetailStore.movie" class="absolute inset-0 bg-black opacity-60"></div>

    <!-- Movie Detail Content -->
    <div v-if="movieDetailStore.movie" class="relative z-10 max-w-5xl mx-auto p-6 rounded-lg text-white">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
        <!-- Movie Poster -->
        <img
          :src="movieDetailStore.movie.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetailStore.movie.poster_path}` : '/default-poster.jpg'"
          alt="Movie Poster" class="rounded-lg shadow-lg w-full md:w-1/3 z-10" />

        <!-- Movie Info -->
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center gap-2">
            <h1 class="text-2xl md:text-3xl font-bold">{{ movieDetailStore.movie.title }}</h1>

            <!-- Average Rating Section -->
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor" aria-hidden="true">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span class="text-xl font-bold">{{ movieDetailStore.movie.vote_average.toFixed(1) }}</span>
            </div>
          </div>
          <p class="text-gray-300 text-sm md:text-base">
            <strong>Release Date:</strong> {{ movieDetailStore.movie.release_date }}
          </p>
          <p class="text-gray-300 text-sm md:text-base">
            <strong>Genres:</strong> {{ movieDetailStore.movie.genres.map((g: any) => g.name).join(", ") }}
          </p>
          <p class="text-gray-200 text-sm md:text-base">{{ movieDetailStore.movie.overview }}</p>

          <div class="flex gap-4">
            <button @click="movieDetailStore.viewTrailer(movieDetailStore.movie.id)"
              class="bg-yellow-500 text-black p-2 rounded-lg">See Trailer</button>
            <button @click="reviewStore.toggleRateAndSetReviewMovieId"
              class="border-2 border-white text-yellow-500 p-2 rounded-lg">
              Rate
            </button>


            <div class="relative inline-block w-full sm:w-auto">
              <!-- Add to List Button -->
              <button @click="movieDetailStore.toggleDropdown"
                class="bg-green-500 text-white py-3 px-6 w-full sm:w-auto rounded-lg transition ease-in-out duration-150 transform hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                Add to List
              </button>

              <!-- Dropdown -->
              <div v-if="movieDetailStore.isDropdownOpen" @click.outside="movieDetailStore.isDropdownOpen = false"
                class="absolute top-full left-0 mt-4 w-full sm:w-56 md:w-64 bg-white border border-gray-200 rounded-lg shadow-lg transition ease-in-out duration-150 transform z-10 sm:left-auto sm:ml-2 sm:top-0">
                <ul class="py-1 max-h-60 overflow-y-auto">
                  <!-- Check if lists exist -->
                  <template v-if="listStore.lists.length > 0">
                    <li v-for="list in listStore.lists" :key="list.id"
                      class="hover:bg-gray-100 focus-within:bg-gray-100">
                      <button
                        @click="() => listStore.selectList(list.id, movieDetailStore.movie, () => movieDetailStore.isDropdownOpen = false)"
                        class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {{ list.name }}
                      </button>
                    </li>
                  </template>

                  <!-- Display message when no lists are available -->
                  <template v-else>
                    <li class="text-gray-500 px-4 py-2 text-sm">No lists created</li>
                  </template>
                </ul>
              </div>
            </div>



            <div v-if="movieDetailStore.openRatePopup"
              class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">

              <div class="bg-gray-800 text-white p-6 rounded-lg max-w-sm w-full">
                <h2 class="text-xl font-bold mb-4">Rate: {{ movieDetailStore.movie.title }}</h2>

                <!-- Review Input -->
                <textarea v-model="reviewStore.newReviewContent" placeholder="Write your review here..."
                  class="w-full h-24 p-2 rounded-lg bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>


                <!-- Rating Input -->
                <div class="mt-4">
                  <label for="rating" class="block mb-2">Your Rating:</label>
                  <select v-model="reviewStore.newReviewRating" id="rating"
                    class="w-full p-2 rounded-lg bg-gray-900 text-gray-200">
                    <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-4 mt-6">
                  <button @click="reviewStore.handleSubmit" class="bg-yellow-500 text-black px-4 py-2 rounded-lg">
                    Submit
                  </button>
                  <button @click="movieDetailStore.closeRatePopup" class="bg-gray-600 px-4 py-2 rounded-lg">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div v-if="movieDetailStore.reviews.length" class="mt-14">
        <h2 class="text-xl font-bold mb-4">Reviews</h2>
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div v-for="review in movieDetailStore.reviews.slice(0, 6)" :key="review.id"
            class="p-4 bg-gray-800 rounded-lg flex flex-col justify-between">
            <h3 class="text-lg font-bold">{{ review.author }}</h3>
            <p class="text-gray-300 mt-2 line-clamp-3">
              {{ review.content }}
            </p>
            <a class="text-yellow-500 mt-4 cursor-pointer hover:underline"
              @click="movieDetailStore.openReviewModal(review.content)">
              See more
            </a>
          </div>
        </div>
      </div>

      <div v-if="movieDetailStore.showReviewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75">
        <div class="bg-white rounded-lg shadow-xl w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-xl font-bold">Full Review</h3>
            <button class="text-gray-500 hover:text-gray-800" @click="movieDetailStore.closeReviewModal()">
              ✕
            </button>
          </div>
          <div class="p-6">
            <p class="text-gray-800 whitespace-pre-line">
              {{ movieDetailStore.selectedReview }}
            </p>
          </div>
          <div class="flex justify-end p-4 border-t">
            <button class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              @click="movieDetailStore.closeReviewModal()">
              Close
            </button>
          </div>
        </div>
      </div>
      <!-- Cast Section -->
      <div v-if="movieDetailStore.cast.length" class="mt-6">
        <h2 class="text-xl font-bold">Cast</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          <div v-for="actor in movieDetailStore.cast.slice(0, 10)" :key="actor.id" class="text-center">
            <img
              :src="actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : '/default-profile.png'"
              alt="Actor Photo" class="rounded-lg shadow-md" />
            <p class="text-gray-300 mt-2">{{ actor.name }}</p>
          </div>
        </div>
      </div>


      <!-- Videos Section -->
      <div v-if="movieDetailStore.videos.length" class="mt-6">
        <h2 class="text-xl font-bold mb-4">Videos</h2>
        <div class="flex gap-4 overflow-x-auto custom-scrollbar">
          <div v-for="video in movieDetailStore.videos" :key="video.key" class="flex-none w-64">
            <img :src="`https://img.youtube.com/vi/${video.key}/0.jpg`" alt="Video Thumbnail"
              class="rounded-lg shadow-md cursor-pointer" @click="movieDetailStore.viewVideo(video.key)" />
          </div>
        </div>
      </div>


      <!-- Images Section -->
      <div v-if="movieDetailStore.images.backdrops" class="mt-6">
        <h2 class="text-xl font-bold mb-4">Images</h2>
        <div class="flex gap-4 overflow-x-auto custom-scrollbar">
          <div v-for="image in movieDetailStore.images.backdrops" :key="image.file_path" class="flex-none w-64">
            <img :src="`https://image.tmdb.org/t/p/w500${image.file_path}`" alt="Movie Image"
              class="rounded-lg shadow-md cursor-pointer" @click="movieDetailStore.viewImage(image.file_path)" />
          </div>
        </div>
      </div>

      <!-- Image Modal -->
      <div v-if="movieDetailStore.showImageModal" class="modal" @click.self="movieDetailStore.closeImageModal">
        <div class="modal-content">
          <img :src="`https://image.tmdb.org/t/p/original${movieDetailStore.selectedImagePath}`" alt="Movie Image"
            class="w-full h-auto" />
        </div>
      </div>



      <!-- Similar Movies -->
      <div v-if="movieDetailStore.similarMovies.length" class="mt-6">
        <h2 class="text-xl font-bold mb-4">Similar Movies</h2>
        <div class="flex gap-4 overflow-x-auto custom-scrollbar">
          <div v-for="movie in movieDetailStore.similarMovies.slice(0, 10)" :key="movie.id"
            class="flex-none w-40 text-center">
            <router-link :to="`/movie/${movie.id}`">
              <img
                :src="movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/default-poster.jpg'"
                alt="Movie Poster" :class="{
                  'w-full rounded-md shadow-lg hover:scale-105 transition-transform': true,
                  'h-[240px]': !movie.poster_path,
                  'h-auto': movie.poster_path
                }" />
            </router-link>
            <p class="text-gray-300 mt-2">{{ movie.title }}</p>
          </div>
        </div>
      </div>
    </div>


    <!-- Trailer Modal -->
    <div v-if="movieDetailStore.showModal" class="modal" @click.self="movieDetailStore.closeModal">
      <div class="modal-content">
        <iframe :src="`https://www.youtube.com/embed/${movieDetailStore.trailerKey}`" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useListStore } from "../stores/listsStore";
import { useMovieDetailStore } from "../stores/movieDetailStore";
import { useRoute } from "vue-router";
import { useReviewStore } from "../stores/reviewStore";
import Navbar from "./Navbar.vue";


const route = useRoute();
const listStore = useListStore();
const movieDetailStore = useMovieDetailStore();
const reviewStore = useReviewStore();

const movieId = route.params.id;


watch(() => route.params.id, (newId) => {
  movieDetailStore.fetchMovieData(newId);
});

onMounted(() => {
  movieDetailStore.fetchMovieData(movieId);
  listStore.fetchLists();

  window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<style scoped>
.bg-custom-background {
  background: linear-gradient(to right, #0b101a, #1a2b3f);
  min-height: 50vh;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.movie-detail {
  position: relative;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 0.5rem;
}

.bg-cover {
  background-size: cover;
}

.bg-center {
  background-position: center;
}

.relative .btn {
  /* Remove the animation and opacity */
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.relative .btn button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border: 2px solid #fff;
}

.relative .btn button:nth-child(1) {
  margin-right: 15px;
}

.relative .btn button:nth-child(1):hover {
  background-color: #1f1f1a91;
  color: #fff;
  transform: scale(1.05);
}

.relative .btn button:nth-child(2) {
  background: transparent;
  color: #ffd700;
  border: 2px solid #fff;
  transition: 0.3s;
}

.relative .btn button:nth-child(2):hover {
  background-color: #ffd700;
  color: #fff;
  border-color: #ffd700;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #000;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 90%;
  max-width: 1200px;
}

.modal-content iframe {
  width: 100%;
  height: 675px;
  border-radius: 8px;
}


.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #888;
  /* Thumb color */
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

/* Add smooth fade-in effect for dropdown */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>