<template>
  <div class="carousel relative w-full h-screen overflow-hidden mt-[-50px]">
    <div class="list flex transition-transform duration-1000 absolute top-2/4 left-3/4">
      <div v-for="(item, index) in items" :key="index"
        class="item relative w-[180px] h-[250px] rounded-lg shadow-lg bg-cover bg-center z-100 transition"
        :style="{ backgroundImage: 'url(' + item.image + ')' }">
        <div class="content absolute top-1/2 left-0 transform -translate-y-1/2 w-full text-white p-4">
          <div class="title text-4xl font-bold">{{ item.title }}</div>
          <div class="name text-2xl font-semibold">{{ item.name }}</div>
          <div class="des mt-2">{{ item.description }}</div>
          <div class="btn mt-4">
            <button class="btn btn-primary mr-4">Ver Tráiler</button>
            <button class="btn btn-secondary">Valorar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="arrows absolute top-2/3 left-1/2 transform -translate-x-1/2 flex space-x-4">
      <button @click="prev" class="prev bg-yellow-500 text-white p-2 rounded-full"> &lt; </button>
      <button @click="next" class="next bg-yellow-500 text-white p-2 rounded-full"> &gt; </button>
    </div>

    <div class="timeRunning absolute top-0 left-0 w-0 h-1 bg-yellow-500"></div>
  </div>
</template>

<script>
import spiderman1 from '../assets/image/spiderman1.svg'

export default {
  name: "Carousel",
  data() {
    return {
      items: [
        {
          title: "SPIDERMAN",
          name: "HOME COMING",
          description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
          image: spiderman1
        },
        {
          title: "SPIDERMAN",
          name: "NO WAY HOME",
          description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
          image: "../assets/image/spiderman2.svg"
        },
        // Add more items here
      ],
      currentIndex: 0,
    };
  },
  methods: {
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
    },
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    },
  },
  mounted() {
    // Auto next functionality
    setInterval(this.next, 7000);
  },
};
</script>

<style scoped>
.carousel .list .item {
  background-size: cover;
  background-position: center;
  transition: transform 1s ease;
}

.carousel .arrows button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ffd700;
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: bold;
}

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
