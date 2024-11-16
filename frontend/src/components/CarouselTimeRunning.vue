<template>
  <div class="timeRunning"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CarouselTimeRunning",
});
</script>

<style scoped>
/* time running */
.carousel .timeRunning {
  position: absolute;
  z-index: 1000;
  width: 0%;
  height: 4px;
  background-color: #ffd700;
  left: 0;
  top: 0;
  animation: runningTime 7s linear 1 forwards;
}

@keyframes runningTime {
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
}
</style>