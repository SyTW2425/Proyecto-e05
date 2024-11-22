<!-- use routers -->
<template>
  <div id="app">
    <AlertComponent />
    <router-view />
  </div>
</template>

<script setup>
import AlertComponent from './components/AlertComponent.vue';
</script>