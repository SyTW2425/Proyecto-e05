<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <div class="text-center">
      <!-- Big 404 Text -->
      <h1 class="text-9xl font-extrabold text-yellow-500">404</h1>
      <p class="text-2xl mt-4 font-semibold">Oops! Page Not Found</p>
      <p class="text-gray-300 mt-2">
        The page you are looking for might have been removed, renamed, or is temporarily unavailable.
      </p>

      <!-- Navigation Buttons -->
      <div class="mt-8 flex justify-center gap-4">
        <router-link to="/" class="px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600">
          Go Home
        </router-link>
        <router-link to="/contact" class="px-6 py-2 border border-yellow-500 font-semibold rounded-lg hover:bg-gray-800">
          Contact Us
        </router-link>
      </div>
    </div>

    <!-- Decorative SVG -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg class="w-full h-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#f5c51c"
          fill-opacity="1"
          d="M0,256L48,250.7C96,245,192,235,288,240C384,245,480,267,576,277.3C672,288,768,288,864,256C960,224,1056,160,1152,160C1248,160,1344,224,1392,256L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "NotFound",
};
</script>

<style scoped>
</style>