<template>
  <div class="carousel">
    <div class="list">
      <CarouselItem v-for="(item, index) in items" :key="index" :title="item.title" :name="item.name"
        :description="item.description" :image="item.image" :active="index === activeIndex" />
    </div>
    <CarouselControls @prev="showSlider('prev')" @next="showSlider('next')" />
    <CarouselTimeRunning />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import CarouselItem from "./CarouselItem.vue";
import CarouselControls from "./CarouselControls.vue";
import CarouselTimeRunning from "./CarouselTimeRunning.vue";

export default defineComponent({
  name: "Carousel",
  components: { CarouselItem, CarouselControls, CarouselTimeRunning },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const activeIndex = ref(0);

    const showSlider = (direction: "prev" | "next") => {
      activeIndex.value = direction === "next"
        ? (activeIndex.value + 1) % 8
        : (activeIndex.value - 1 + 8) % 8;
    };

    return { activeIndex, showSlider };
  },
});
</script>

<style scoped>
/* Carousel Section */
.carousel {
  width: 100vw;
  height: 100vh;
  margin-top: -50px;
  overflow: hidden;
  position: relative;
}

/* Responsive Background Image Adjustments */
@media screen and (max-width: 999px) {
  .carousel {
    background-size: contain; /* Ensures the background image is fully visible */
  }
}

@media screen and (max-width: 690px) {
  .carousel {
    background-size: contain; /* Same as above for smaller screens */
  }
}

.carousel .list .item:nth-child(1),
.carousel .list .item:nth-child(2) {
  top: 0;
  left: 0;
  transform: translate(0, 0);
  border-radius: 0;
  width: 100%;
  height: 100%;
}

.carousel .list .item:nth-child(3) {
  left: 67%;
}

.carousel .list .item:nth-child(4) {
  left: calc(67% + 200px);
}

.carousel .list .item:nth-child(5) {
  left: calc(67% + 400px);
}

.carousel .list .item:nth-child(6) {
  left: calc(67% + 600px);
}

.carousel .list .item:nth-child(n + 7) {
  left: calc(67% + 800px);
  opacity: 0;
}

.carousel .list .item {
  width: 180px;
  height: 250px;
  position: absolute;
  top: 80%;
  transform: translateY(-70%);
  left: 70%;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  background-position: 50% 50%;
  background-size: cover;
  z-index: 100;
  transition: 1s;
}

.list .item .content {
  position: absolute;
  top: 50%;
  left: 100px;
  transform: translateY(-50%);
  width: 400px;
  text-align: left;
  color: #fff;
  display: none;
}

.list .item:nth-child(2) .content {
  display: block;
}




</style>