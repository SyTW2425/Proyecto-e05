<template>
  <div class="relative bg-custom-background font-[poppins]">
    <!-- Background Image -->
    <div v-if="movie" class="absolute inset-0 w-full h-[550px] bg-cover bg-center" :style="movieBackgroundStyle"></div>
    <div v-if="movie" class="absolute inset-0 bg-black opacity-60"></div>

    <!-- Movie Detail Content -->
    <div v-if="movie" class="relative z-10 max-w-5xl mx-auto p-6 rounded-lg text-white">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
        <!-- Movie Poster -->
        <img :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-poster.png'"
          alt="Movie Poster" class="rounded-lg shadow-lg w-full md:w-1/3 z-10" />

        <!-- Movie Info -->
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center gap-2">
            <h1 class="text-2xl md:text-3xl font-bold">{{ movie.title }}</h1>

            <!-- Average Rating Section -->
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor" aria-hidden="true">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span class="text-xl font-bold">{{ movie.vote_average.toFixed(1) }}</span>
            </div>
          </div>
          <p class="text-gray-300 text-sm md:text-base">
            <strong>Release Date:</strong> {{ movie.release_date }}
          </p>
          <p class="text-gray-300 text-sm md:text-base">
            <strong>Genres:</strong> {{ movie.genres.map((g) => g.name).join(", ") }}
          </p>
          <p class="text-gray-200 text-sm md:text-base">{{ movie.overview }}</p>


          <div class="flex gap-4">
            <button @click="viewTrailer(movie.id)" class="bg-yellow-500 text-black p-2 rounded-lg">See Trailer</button>
            <button @click="rateMovie(movie.id)"
              class="border-2 border-white text-yellow-500 p-2 rounded-lg">Rate</button>
            <button @click="toggleDropdown" class="bg-green-500 text-white p-3 px-6 rounded-lg transition ease-in-out duration-150 transform hover:bg-green600 focus:outline-none focus:ring-2 focus:ring-green-400">
              Add to List
            </button>

            <div v-if="isDropdownOpen"
              class="absolute mt-2 ml-80 w-48 bg-[#1a2b3f] border border-gray-200 rounded-lg shadow-lg z-10 transition-opacity opacity-0 animate-fadeIn">
              <ul class="py-2">
                <li v-for="list in userLists" :key="list.id" class="px-4 py-2 hover:bg-[#2a3a50] cursor-pointer transition-colors ease-in-out duration-150"
                  @click="addToList(list)">
                  {{ list.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section (SE CAMBIARA POR LA DE LOS USUARIOS ALMACENADOS) -->
      <div v-if="reviews.length" class="mt-14">
        <h2 class="text-xl font-bold mb-4">Reviews</h2>
        <div class="flex gap-4 overflow-x-auto scrollbar-hide">
          <div v-for="review in reviews.slice(0, 6)" :key="review.id" class="flex-none w-64 p-4 bg-gray-800 rounded-lg">
            <h3 class="text-lg font-bold">{{ review.author }}</h3>
            <p class="text-gray-300 mt-2">
              {{ review.content.slice(0, 100) }}...
              <a class="text-yellow-500" href="#">See more</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Cast Section -->
      <div v-if="cast.length" class="mt-6">
        <h2 class="text-xl font-bold">Cast</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          <div v-for="actor in cast.slice(0, 10)" :key="actor.id" class="text-center">
            <img
              :src="actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : '/default-profile.png'"
              alt="Actor Photo" class="rounded-lg shadow-md" />
            <p class="text-gray-300 mt-2">{{ actor.name }}</p>
          </div>
        </div>
      </div>


      <!-- Videos Section -->
      <div v-if="videos.length" class="mt-6">
        <h2 class="text-xl font-bold mb-4">Videos</h2>
        <div class="flex gap-4 overflow-x-auto scrollbar-hide">
          <div v-for="video in videos" :key="video.key" class="flex-none w-64">
            <img :src="`https://img.youtube.com/vi/${video.key}/0.jpg`" alt="Video Thumbnail"
              class="rounded-lg shadow-md cursor-pointer" @click="viewVideo(video.key)" />
          </div>
        </div>
      </div>


      <!-- Images Section -->
      <div v-if="images.backdrops.length" class="mt-6">
        <h2 class="text-xl font-bold mb-4">Images</h2>
        <div class="flex gap-4 overflow-x-auto scrollbar-hide">
          <div v-for="image in images.backdrops" :key="image.file_path" class="flex-none w-64">
            <img :src="`https://image.tmdb.org/t/p/w500${image.file_path}`" alt="Movie Image"
              class="rounded-lg shadow-md cursor-pointer" @click="viewImage(image.file_path)" />
          </div>
        </div>
      </div>

      <!-- Image Modal -->
      <div v-if="showImageModal" class="modal" @click.self="closeImageModal">
        <div class="modal-content">
          <img :src="`https://image.tmdb.org/t/p/original${selectedImagePath}`" alt="Movie Image"
            class="w-full h-auto" />
        </div>
      </div>



      <!-- Similar Movies -->
      <div v-if="similarMovies.length" class="mt-6">
        <h2 class="text-xl font-bold mb-4">Similar Movies</h2>
        <div class="flex gap-4 overflow-x-auto scrollbar-hide">
          <div v-for="movie in similarMovies.slice(0, 10)" :key="movie.id" class="flex-none w-40 text-center">
            <router-link :to="`/movie/${movie.id}`">
              <img
                :src="movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/default-poster.png'"
                alt="Movie Poster" class="rounded-lg shadow-md" />
            </router-link>
            <p class="text-gray-300 mt-2">{{ movie.title }}</p>
          </div>
        </div>
      </div>
    </div>


    <!-- Trailer Modal -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <iframe :src="`https://www.youtube.com/embed/${trailerKey}`" title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      movie: null,
      cast: [],
      similarMovies: [],
      reviews: [],
      images: [],
      videos: [],
      showModal: false,
      trailerKey: "",
      selectedImagePath: "",
      showImageModal: false,
      movieBackgroundStyle: {
        backgroundImage: "none",
        backgroundColor: "bg-custom-background",
      },
      isDropdownOpen: false,
      userLists: [
        { id: 1, name: "Watchlist" },
        { id: 2, name: "Favorites" },
        { id: 3, name: "Watched" },
      ],
    };
  },
  methods: {
    async fetchMovieData() {
      const movieId = this.$route.params.id;
      try {
        const { data: movie } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}`
        );
        this.movie = movie;

        const { data: credits } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/credits`
        );
        this.cast = credits.cast;

        // Fetch movie images for background
        const { data: images } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/images`
        );
        this.images = images;

        // get videos
        const { data: videos } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/videos`
        );
        this.videos = videos.results;

        if (images.backdrops.length) {
          const backdrop = images.backdrops[0].file_path;
          this.movieBackgroundStyle = {
            backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop})`,
            backgroundSize: "cover", // Ensures the background spans the width
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          };
        } else {
          this.movieBackgroundStyle.backgroundImage =
            "url('/default-background.jpg')";
        }

        const { data: similarMovies } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/similar`
        );
        this.similarMovies = similarMovies || [];

        // Fetch movie reviews
        const { data: reviews } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/reviews`
        );
        this.reviews = reviews.results || [];

      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    },
    async viewImage(imagePath) {
      this.selectedImagePath = imagePath;
      this.showImageModal = true;
    },

    async viewVideo(videoKey) {
      this.showModal = true;
      this.trailerKey = videoKey;
    },
    async viewTrailer(movieId) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/trailers`
        );
        const trailers = response.data;
        if (trailers.length > 0) {
          const trailerKey = trailers[0].key;
          this.showModal = true;
          this.trailerKey = trailerKey;
        } else {
          alert('No trailers available for this movie.');
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
        alert('Failed to fetch trailer.');
      }
    },
    rateMovie(movieId) {
      alert(`Rated movie with ID: ${movieId}`);
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    addToList(list) {
      alert(`Added to ${list.name}`);
      this.isDropdownOpen = false;
    },
    closeModal() {
      this.showModal = false;
    },
    closeImageModal() {
      this.showImageModal = false;
    },
  },
  mounted() {
    this.fetchMovieData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  watch: {
    '$route.params.id': function () {
      this.fetchMovieData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  }
};
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

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
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