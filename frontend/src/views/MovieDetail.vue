<template>
  <div class="bg-custom-background min-h-screen">
    
    <MovieDetail />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import MovieDetail from '../components/MovieDetail.vue';

export default defineComponent({
  components: { Navbar, MovieDetail },
});
</script>

<style scoped>
.bg-custom-background {
  background-image: linear-gradient(to right, #0b101a, #1a2b3f);
  background-size: cover;
  background-position: center;
}
</style>