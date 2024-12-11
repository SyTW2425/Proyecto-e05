<template>
  <div class="bg-custom-background min-h-screen px-4 py-8 md:p-8">
    <!-- Search Bar -->
    <div class="flex justify-center items-center gap-4 mt-8 mb-8">
      <input v-model="searchQuery" type="text" placeholder="Search for a movie..."
        class="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 text-sm font-[poppins]"
        @input="handleSearch" />
    </div>

    <!-- Category Buttons -->
    <div class="flex justify-center gap-2 mb-6 flex-wrap items-center">
      <button v-for="genre in genres" :key="genre.id" @click="toggleCategory(genre.id)"
        class="px-4 py-2 rounded-lg text-white font-poppins hover:bg-yellow-400 transition-all duration-200"
        :class="selectedGenres.includes(genre.id) ? 'bg-yellow-500' : 'bg-gray-700 hover:bg-gray-600'">
        {{ genre.name }}
      </button>

      <!-- Clear Filters Button -->
      <button v-if="selectedGenres.length > 0 || searchQuery.trim() !== ''" @click="clearFilters"
        class="px-4 py-2 rounded-lg bg-red-600 text-white font-poppins hover:bg-red-500 transition-all duration-200">
        Clear
      </button>
    </div>

    <!-- Movies Grid -->
    <div v-if="movies.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
      <div v-for="movie in movies" :key="movie.id" class="text-center">
        <router-link :to="`/movie/${movie.id}`">
          <img :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/default-poster.jpg'"
            alt="Movie Poster" class="{
              'w-full rounded-md shadow-lg hover:scale-105 transition-transform': true,
              'h-[331px]': !movie.poster_path,
              'h-auto': movie.poster_path
            }" />
          <h2 class="text-white mt-2 font-bold text-sm sm:text-base">{{ movie.title }}</h2>
          <p class="text-gray-400 text-xs sm:text-sm">{{ movie.release_date ? movie.release_date.split('-')[0] : 'N/A' }}</p>

          <!-- Average Rating Section -->
          <div class="flex items-center gap-2 justify-center mt-1">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="currentColor" aria-hidden="true">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span class="text-sm sm:text-xl text-white font-bold">{{ movie.vote_average.toFixed(1) || 'N/A' }}</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- No Movies Found -->
    <div v-else-if="!loading && !error" class="text-center text-gray-400 text-sm sm:text-base">No movies found. Try another search!</div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center text-yellow-400 text-sm sm:text-base">Loading movies...</div>

    <!-- Error Message -->
    <div v-if="error" class="text-center text-red-500 text-sm sm:text-base">Error fetching movies: {{ error }}</div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8 flex-wrap">
      <button v-for="page in pagesToShow" :key="page" @click="changePage(page)" class="mx-2 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base"
        :class="page === currentPage ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white hover:bg-gray-500'">
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

// Movie model for the search
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

export default defineComponent({
  name: "Films",
  data() {
    return {
      searchQuery: "",
      movies: [] as Movie[],
      currentPage: 1,
      totalPages: 0,
      loading: false,
      error: "",
      genres: [] as Genre[], // Store genres
      selectedGenres: [] as number[], // Store selected genre IDs
    };
  },
  computed: {
    pagesToShow() {
      const maxPages = 10;
      const total = this.totalPages < maxPages ? this.totalPages : maxPages;
      return Array.from({ length: total }, (_, i) => i + 1);
    },
  },
  methods: {
    async fetchGenres() {
      try {
        const response = await axios.get("http://localhost:5001/api/moviesdb/genres");

        if (response.data && Array.isArray(response.data.genres.genres)) {
          this.genres = response.data.genres.genres;
        } else {
          console.error("Invalid genres data format:", response);
          throw new Error("Invalid genres data format");
        }
      } catch (err) {
        console.error("Error fetching genres:", err);
        this.error = "Failed to load genres.";
      }
    },
    async fetchMovies() {
      this.loading = true;
      this.error = "";
      try {
        const isSearchMode = this.searchQuery.trim().length > 0;

        let endpoint: string;
        let params: Record<string, any> = { page: this.currentPage };

        // Decide the endpoint and parameters
        if (isSearchMode) {
          endpoint = "http://localhost:5001/api/moviesdb/search";
          params.query = this.searchQuery;
        } else if (this.selectedGenres.length > 0) {
          endpoint = "http://localhost:5001/api/moviesdb/movies-by-genres";
          params.genres = this.selectedGenres.join(",");
        } else {
          endpoint = "http://localhost:5001/api/moviesdb/search-popular";
        }

        // Fetch data from the endpoint
        const response = await axios.get<{
          results: Movie[];
          page: number;
          total_pages: number;
        }>(endpoint, { params });

        // Update movies and pagination
        this.movies = response.data.results.map((movie: Movie) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
        }));

        this.totalPages = response.data.total_pages;
      } catch (err) {
        console.error("Error fetching movies:", err);
        this.error = "Failed to load movies. Please try again later.";
        this.movies = [];
      } finally {
        this.loading = false;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    toggleCategory(genreId: number) {
      const index = this.selectedGenres.indexOf(genreId);
      if (index === -1) {
        this.selectedGenres.push(genreId);
      } else {
        this.selectedGenres.splice(index, 1);
      }
      this.updateQueryParams();
      this.fetchMovies();
    },
    handleSearch() {
      this.currentPage = 1;
      this.updateQueryParams();
      this.fetchMovies();
    },
    changePage(page: number) {
      this.currentPage = page;
      this.updateQueryParams();
      this.fetchMovies();
    },
    clearFilters() {
      this.searchQuery = "";
      this.selectedGenres = [];
      this.currentPage = 1;
      this.updateQueryParams();
      this.fetchMovies();
    },
    updateQueryParams() {
      this.$router.push({
        path: this.$route.path,
        query: {
          page: this.currentPage.toString(),
          genres: this.selectedGenres.join(","),
          query: this.searchQuery.trim() || undefined, // Remove `query` if empty
        },
      });
    },
  },
  watch: {
    '$route.query'(newQuery) {
      this.currentPage = parseInt(newQuery.page as string, 10) || 1;
      this.selectedGenres = newQuery.genres
        ? (newQuery.genres as string).split(",").map((id) => parseInt(id.trim(), 10))
        : [];
      this.searchQuery = newQuery.query ? (newQuery.query as string) : "";

      this.fetchMovies();
    },
  },
  mounted() {
    // Extract state from query parameters
    const { page, genres, query } = this.$route.query;

    this.currentPage = parseInt(page as string, 10) || 1;
    this.selectedGenres = genres
      ? (genres as string).split(",").map((id) => parseInt(id.trim(), 10))
      : [];
    this.searchQuery = query ? (query as string) : "";

    this.fetchGenres();
    this.fetchMovies();
  }
});
</script>


<style scoped>
.bg-custom-background {
  background-image: linear-gradient(to right, #0b101a, #1a2b3f);
  background-size: cover;
  background-position: center;
}

button {
  transition: all 0.3s ease;
}

input {
  transition: box-shadow 0.3s ease;
}

.flex-wrap {
  flex-wrap: wrap;
}

button {
  margin: 0.5rem;
}
</style>