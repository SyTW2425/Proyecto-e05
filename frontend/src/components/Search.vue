<template>
  <div class="bg-custom-background min-h-screen p-8">
    <!-- Search Bar -->
    <div class="flex justify-center items-center gap-4 mb-8">
      <input v-model="searchQuery" type="text" placeholder="Search for a movie..."
        class="w-3/4 md:w-1/3 px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 text-sm font-[poppins]"
        @input="handleSearch" />
    </div>

    <!-- Movies Grid -->
    <div v-if="movies.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      <div v-for="movie in movies" :key="movie.id" class="text-center">
        <img
          :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '../src/assets/image/no-image.svg'"
          alt="Movie Poster" class="w-full rounded-md shadow-lg hover:scale-105 transition-transform" />
        <h2 class="text-white mt-2 font-bold">{{ movie.title }}</h2>
        <p class="text-gray-400">{{ movie.release_date ? movie.release_date.split('-')[0] : 'N/A' }}</p>
        <p class="text-yellow-400 font-bold">⭐ {{ movie.vote_average.toFixed(1) || 'N/A' }}</p>
      </div>
    </div>

    <!-- No Movies Found -->
    <div v-else-if="!loading && !error" class="text-center text-gray-400">No movies found. Try another search!</div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center text-yellow-400">Loading movies...</div>

    <!-- Error Message -->
    <div v-if="error" class="text-center text-red-500">Error fetching movies: {{ error }}</div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <button v-for="page in pagesToShow" :key="page" @click="changePage(page)" class="mx-2 px-4 py-2 rounded-lg"
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

export default defineComponent({
  name: "Search",
  data() {
    return {
      searchQuery: "",
      movies: [] as Movie[],
      currentPage: 1,
      totalPages: 0,
      loading: false,
      error: "",
    };
  },
  computed: {
    pagesToShow() {
      const maxPages = 10;
      const total = this.totalPages < maxPages ? this.totalPages : maxPages;
      return Array.from({ length: total }, (_, i) => i + 1);
    }
  },
  methods: {
    async fetchMovies() {
      this.loading = true;
      this.error = "";
      try {
        if (this.searchQuery.trim() !== "") {
          this.currentPage = 1;
        }

        // Determine whether to fetch most popular movies or search results
        const isSearchMode = this.searchQuery.trim().length > 0;
        const endpoint = isSearchMode
          ? "http://localhost:5001/api/moviesdb/search"
          : "http://localhost:5001/api/moviesdb/search-popular";

        const params = isSearchMode
          ? { query: this.searchQuery, page: this.currentPage}
          : { page: this.currentPage};

        const response = await axios.get<{
          results: Movie[];
          page: number;
          total_pages: number;
        }>(endpoint, { params });

        // Update total pages
        this.totalPages = response.data.total_pages;

        // Update movies and pagination details
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
    },
    handleSearch() {
      this.currentPage = 1;
      this.fetchMovies();
    },
    changePage(page: number) {
      this.currentPage = page;
      this.fetchMovies();
    },
  },
  watch: {
    searchQuery(newQuery) {
      if (!newQuery.trim()) {
        this.fetchMovies();
      }
    },
  },
  mounted() {
    this.fetchMovies();
  },
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
</style>