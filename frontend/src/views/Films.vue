<template>
  <div class="bg-custom-background min-h-screen">
    <Navbar />
    <Films />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import Films from '../components/Films.vue'; // Correctly import Films 

export default defineComponent({
  components: { Navbar, Films },
});
</script>

<style scoped>
.bg-custom-background {
  background-image: linear-gradient(to right, #0b101a, #1a2b3f);
  background-size: cover;
  background-position: center;
}
</style>