<template>
  <div v-if="alert" :class="alert.type">
    {{ alert.message }}
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAlertStore } from '../stores/alert';

const alertStore = useAlertStore();
const alert = computed(() => alertStore.alert);
</script>

<style scoped>
.alert-success {
  color: green;
}

.alert-danger {
  color: red;
}
</style>