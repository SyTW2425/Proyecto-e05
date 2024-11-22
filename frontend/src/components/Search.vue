<template>
  <div class="bg-custom-background min-h-screen p-8">
    <!-- Search Bar -->
    <div class="flex justify-center items-center gap-4 mb-8">
      <input v-model="searchQuery" type="text" placeholder="Search for a movie..."
        class="w-3/4 md:w-1/3 px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400 text-sm font-[poppins]" />
    </div>

    <!-- Category Filters -->
    <div class="flex flex-wrap gap-4 justify-center mb-8">
      <button v-for="(category, index) in categories" :key="index" @click="filterCategory(category)"
        class="px-4 py-2 rounded-lg font-semibold"
        :class="category === selectedCategory ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white hover:bg-gray-500'">
        {{ category }}
      </button>
    </div>

    <!-- Movies Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      <div v-for="movie in paginatedMovies" :key="movie.id" class="text-center">
        <img :src="movie.poster" alt="Movie Poster"
          class="w-full rounded-md shadow-lg hover:scale-105 transition-transform" />
        <h2 class="text-white mt-2 font-bold">{{ movie.title }}</h2>
        <p class="text-gray-400">{{ movie.year }}</p>
        <p class="text-yellow-400 font-bold">⭐ {{ movie.rating }}</p>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="paginatedMovies.length > 0" class="flex justify-center mt-8">
      <button v-for="page in totalPages" :key="page" @click="currentPage = page" class="mx-2 px-4 py-2 rounded-lg"
        :class="page === currentPage ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white hover:bg-gray-500'">
        {{ page }}
      </button>
    </div>
  </div>
</template>

---

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "../components/Navbar.vue";

export default defineComponent({
  name: "Search",
  components: { Navbar },
  data() {
    return {
      searchQuery: "", // For the search input
      selectedCategory: "All",
      categories: ["All", "Action", "Adventure", "Comedy", "Drama", "Sci-Fi"],
      currentPage: 1,
      moviesPerPage: 7,
      movies: [
        { id: 1, poster: "../src/assets/image/avengers3.svg", title: "Avengers: Endgame", year: 2018, rating: 8.5, category: ['Action', 'Comedy'] },
        { id: 2, poster: "../src/assets/image/spiderman1.svg", title: "Spiderman", year: 2018, rating: 7.8, category: ['Adventure', 'Drama'] },
        { id: 3, poster: "../src/assets/image/xmen1.svg", title: "X-Men", year: 2014, rating: 8.6, category: ['Action'] },
        { id: 4, poster: "../src/assets/image/spiderman2.svg", title: "Spiderman 2", year: 2009, rating: 8.0, category: ['Comedy', 'Adventure', 'Sci-Fi'] },
        { id: 5, poster: "../src/assets/image/avengers1.svg", title: "Avengers", year: 2016, rating: 8.1, category: 'Action' },
        { id: 4, poster: "../src/assets/image/spiderman2.svg", title: "Spiderman 2", year: 2009, rating: 8.0, category: 'Sci-Fi' },
        { id: 4, poster: "../src/assets/image/spiderman2.svg", title: "Spiderman 2", year: 2009, rating: 8.0, category: 'Action' },
        { id: 2, poster: "../src/assets/image/spiderman1.svg", title: "Spiderman", year: 2018, rating: 7.8, category: ['Adventure', 'Drama'] },
        { id: 3, poster: "../src/assets/image/xmen1.svg", title: "X-Men", year: 2014, rating: 8.6, category: ['Action'] },
        { id: 5, poster: "../src/assets/image/avengers1.svg", title: "Avengers", year: 2016, rating: 8.1, category: 'Action' },
        { id: 5, poster: "../src/assets/image/aquaman.svg", title: "Aquaman", year: 2016, rating: 8.1, category: 'Action' },
      ],
    };
  },
  computed: {
    filteredMovies() {
      return this.movies.filter((movie) => {
        // Match category
        const matchesCategory =
          this.selectedCategory === "All" ||
          (Array.isArray(movie.category)
            ? movie.category.some((cat) => cat.toLowerCase() === this.selectedCategory.toLowerCase())
            : movie.category.toLowerCase() === this.selectedCategory.toLowerCase());

        // Improved search logic: match the start of the title
        const matchesSearch =
          !this.searchQuery.trim() ||
          movie.title.toLowerCase().startsWith(this.searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      });
    },
    paginatedMovies() {
      // Pagination logic for the filtered movies
      const start = (this.currentPage - 1) * this.moviesPerPage;
      return this.filteredMovies.slice(start, start + this.moviesPerPage);
    },
    totalPages() {
      // Calculate total number of pages
      return Math.ceil(this.filteredMovies.length / this.moviesPerPage);
    },
  },
  methods: {
    filterCategory(category: string) {
      // Set category and reset page
      this.selectedCategory = category;
      this.currentPage = 1;
    },
  },
});
</script>

---

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