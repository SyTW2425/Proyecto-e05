<template>
  <div>
    <Navbar />
    <Carousel :items="carouselItems" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Carousel from '../components/Carousel.vue';
import Navbar from '../components/Navbar.vue';

export default defineComponent({
  name: "App",
  components: { Navbar, Carousel},
  data() {
    return {
      carouselItems: [
        { title: "SPIDERMAN", name: "HOME COMING", description: "Lorem ipsum...", image: "spiderman1.svg" },
        { title: "SPIDERMAN", name: "NO WAY HOME", description: "Lorem ipsum...", image: "spiderman2.svg" },
        { title: "AQUAMAN", name: "LOREM", description: "Lorem ipsum...", image: "aquaman.svg" },
        { title: "AVENGERS", name: "LOREM", description: "Lorem ipsum...", image: "avengers2.svg" },
        { title: "AVENGERS", name: "LOREM", description: "Lorem ipsum...", image: "avengers3.svg" },
        { title: "XMEN", name: "LOREM", description: "Lorem ipsum...", image: "xmen1.svg" },
        { title: "XMEN", name: "LOREM", description: "Lorem ipsum...", image: "xmen2.svg" },
        { title: "XMEN", name: "LOREM", description: "Lorem ipsum...", image: "xmen3.svg" },
      ],
    };
  },
});
</script>
