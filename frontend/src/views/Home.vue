<template>
  <div class="bg-custom-background">
    <Navbar />
    <Carousel  />
  </div>
</template>

<script lang="ts">
import Carousel from '../components/Carousel.vue';
import Navbar from '../components/Navbar.vue';

export default {
  name: "Home",
  components: {
    Navbar,
    Carousel
  }
}; 
</script>

<style scoped>
</style>