<template>
  <div class="bg-custom-background min-h-screen">
    <Navbar />
    <Search />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import Search from '../components/Search.vue'; // Correctly import Search

export default defineComponent({
  components: { Navbar, Search },
});
</script>

<style scoped>
.bg-custom-background {
  background-image: linear-gradient(to right, #0b101a, #1a2b3f);
  background-size: cover;
  background-position: center;
}
</style>