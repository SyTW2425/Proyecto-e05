<template>
  <div>
    <Navbar class="bg-custom-background"/>
    <Profile />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import Profile from '../components/Profile.vue';


export default defineComponent({
  name: 'Home',
  components: { Navbar, Profile},
});
</script>

<style scoped>
.bg-custom-background {
  background-image: linear-gradient(to right, #0b101a, #1a2b3f);
  background-size: cover;
  background-position: center;
}
</style>