<template>
  <div class="item" :style="{ backgroundImage: `url(../src/assets/image/${image})` }" :class="{ active }">
    <div class="content">
      <div class="title">{{ title }}</div>
      <div class="name">{{ name }}</div>
      <div class="des">{{ description }}</div>
      <div class="btn">
        <button>See More</button>
        <button>Subscribe</button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "CarouselItem",
  props: {
    title: String,
    name: String,
    description: String,
    image: String,
    active: Boolean,
  },
});
</script>

<style scoped>
.item {
  position: relative;
  /* Allow positioning of the shadow and content */
  background-size: cover;
  /* Ensure the background image covers the item */
  background-position: center;
}

.item::before {
  content: "";
  /* Create an empty pseudo-element for the shadow */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../src/assets/image/shadow.png');
  /* Path to your shadow image */
  background-size: cover;
  background-position: center;
  z-index: 1;
  /* Place the shadow between the background and content */
  opacity: 0.5;
  /* Optional: adjust the opacity of the shadow */
}

.content {
    position: relative; /* Ensure text content stays above the shadow */
    z-index: 2; /* Text will be on top of the shadow */
    padding: 20px;
    color: white; /* Ensure text is readable depending on your design */
}

.content .title {
  font-size: 100px;
  text-transform: uppercase;
  color: #ffd700;
  font-weight: bold;
  line-height: 1;

  opacity: 0;
  animation: animate 1s ease-in-out 0.3s 1 forwards;
}

.content .name {
  font-size: 100px;
  text-transform: uppercase;
  font-weight: bold;
  line-height: 1;
  text-shadow: 3px 4px 4px rgba(255, 255, 255, 0.8);

  opacity: 0;
  animation: animate 1s ease-in-out 0.6s 1 forwards;
}

.content .des {
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  margin-left: 5px;

  opacity: 0;
  animation: animate 1s ease-in-out 0.9s 1 forwards;
}

.content .btn {
  margin-left: 5px;

  opacity: 0;
  animation: animate 1s ease-in-out 1.2s 1 forwards;
}

.content .btn button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border: 2px solid #fff;
}

.content .btn button:nth-child(1) {
  margin-right: 15px;
}

.content .btn button:nth-child(2) {
  background: transparent;
  color: #ffd700;
  border: 2px solid #fff;
  transition: 0.3s;
}

.content .btn button:nth-child(2):hover {
  background-color: #ffd700;
  color: #fff;
  border-color: #ffd700;
}
</style>