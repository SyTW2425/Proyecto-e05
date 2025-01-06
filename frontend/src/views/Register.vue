<template>
  <div>
    <Register />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Register from '../components/Register.vue';

export default defineComponent({
  name: 'Home',
  components: { Register },
});
</script>