<template>
  <div>
    <Navbar />
    <AboutUs />
  </div>
</template>

<script lang="ts">
import AboutUs from '../components/AboutUs.vue';
import Navbar from '../components/Navbar.vue';

export default {
  name: "Home",
  components: {
    Navbar,
    AboutUs
  }
}; 
</script>

<style scoped>
</style>