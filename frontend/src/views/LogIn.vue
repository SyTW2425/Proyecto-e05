<template>
  <div>
    <LogIn />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LogIn from '../components/LogIn.vue';

export default defineComponent({
  name: 'Home',
  components: { LogIn },
});
</script>