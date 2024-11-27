<template>
  <div>
    <Navbar />
    <Carousel  />
  </div>
</template>

<script lang="ts">
import Carousel from '../components/Home.vue';
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