<template>
  <div>
    <Navbar />
    <Carousel />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Carousel from './components/Carousel.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Carousel
  }
}
</script>

<style>
/* Global styles */
body {
  font-family: 'Poppins', sans-serif;
}
</style>
