<template>
  <div
    class="item w-[180px] h-[250px] absolute top-[80%] transform -translate-y-[70%] left-[70%] rounded-lg shadow-xl z-10 transition-all duration-1000"
    :style="{ backgroundImage: 'url(../assets/images/eagel1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }"

  >
    <div class="content absolute top-1/2 left-24 transform -translate-y-1/2 text-left text-white hidden lg:block">
      <div
        class="title text-5xl text-gold font-bold opacity-0 animate-animate"
        :style="animationStyle(0.3)"
      >
        SLIDER
      </div>
      <div
        class="name text-5xl text-shadow opacity-0 animate-animate"
        :style="animationStyle(0.6)"
      >
        {{ name }}
      </div>
      <div
        class="des mt-2 mb-5 text-xl opacity-0 animate-animate"
        :style="animationStyle(0.9)"
      >
        {{ description }}
      </div>
      <div
        class="btn opacity-0 animate-animate"
        :style="animationStyle(1.2)"
      >
        <button class="bg-transparent text-yellow-500 border-2 border-white p-3 mr-4">
          See More
        </button>
        <button class="text-white border-2 border-white p-3">Subscribe</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CarouselItem",
  props: {
    image: String,
    name: String,
    description: String,
  },
  methods: {
    animationStyle(delay) {
      return {
        animation: `animate 1s ease-in-out ${delay}s forwards`,
      };
    },
  },
};
</script>

<style scoped>
@keyframes animate {
  from {
    opacity: 0;
    transform: translate(0, 100px);
    filter: blur(33px);
  }
  to {
    opacity: 1;
    transform: translate(0);
    filter: blur(0);
  }
}
</style>
