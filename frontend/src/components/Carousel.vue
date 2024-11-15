<template>
  <div class="carousel relative w-full h-screen mt-[-50px] overflow-hidden">
    <div class="list flex">
      <CarouselItem v-for="(item, index) in items" :key="index" :image="item.image" :name="item.name"
        :description="item.description" />
    </div>
    <div class="arrows absolute top-[80%] right-[52%] flex gap-2 items-center">
      <button class="prev bg-yellow-500 text-white w-12 h-12 rounded-full font-bold" @click="moveToPrev">
        ‹
      </button>
      <button class="next bg-yellow-500 text-white w-12 h-12 rounded-full font-bold" @click="moveToNext">
        ›
      </button>
    </div>
    <div class="timeRunning absolute w-0% h-[4px] bg-yellow-500 top-0"></div>
  </div>
</template>

<script>
import CarouselItem from './CarouselItem.vue';

export default {
  name: "Carousel",
  components: {
    CarouselItem,
  },
  data() {
    return {
      currentIndex: 0,
      items: [
        {
          image: "images/eagel1.jpg",
          name: "EAGLE",
          description: "Lorem ipsum dolor sit amet",
        },
        {
          image: "images/owl1.jpg",
          name: "OWL",
          description: "Lorem ipsum dolor sit amet",
        },
        {
          image: "images/crow.jpg",
          name: "CROW",
          description: "Lorem ipsum dolor sit amet",
        },
        // more items...
      ],
    };
  },
  methods: {
    moveToNext() {
      if (this.currentIndex < this.items.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0; // Reset to first item
      }
    },
    moveToPrev() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.items.length - 1; // Move to last item
      }
    },
  },
};
</script>

<style scoped>
.carousel .timeRunning {
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
