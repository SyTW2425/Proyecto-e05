<template>
  <section class="relative bg-cover bg-center h-[500px] flex items-center" :style="{ backgroundImage: `url(${featuredImage})` }">
    <div class="bg-black bg-opacity-50 p-8 rounded-lg max-w-md">
      <h2 class="text-yellow-500 text-sm">Novedades</h2>
      <h1 class="text-white text-3xl font-bold mb-4">{{ featuredTitle }}</h1>
      <p class="text-gray-200 text-sm mb-4">{{ featuredDescription }}</p>
      <div class="flex space-x-4">
        <button class="bg-yellow-500 text-black px-4 py-2 rounded">Ver trailer</button>
        <button class="bg-gray-700 text-white px-4 py-2 rounded">Valorar</button>
      </div>
    </div>
  </section>
</template>

<script setup>
const featuredImage = 'path/to/spiderman-bg.jpg';
const featuredTitle = 'Spider-Man: No Way Home';
const featuredDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec ex sed justo euismod fringilla.';
</script>

<style scoped>
/* Additional styling */
</style>