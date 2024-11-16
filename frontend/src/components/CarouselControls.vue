<template>
  <div class="arrows">
    <button class="prev" @click="$emit('prev')"><</button>
    <button class="next" @click="$emit('next')">></button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CarouselControls",
});
</script>

<style scoped>
.arrows {
  position: absolute;
  top: 80%;
  right: 52%;
  z-index: 100;
  width: 300px;
  max-width: 30%;
  display: flex;
  gap: 10px;
  align-items: center;
}

.arrows button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffd700;
  color: #fff;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: monospace;
  font-weight: bold;
  transition: 0.5s;
  cursor: pointer;
}

.arrows button:hover {
  background: #fff;
  color: #000;
}
</style>