<template>
  <div class="carousel">
    <div class="list">
      <div v-for="(item, index) in items" :key="index" class="item"
        :style="{ backgroundImage: `url(${item.poster_path})` }">
        <div class="content">
          <div class="title">{{ item.title }}</div>
          <!-- Truncated Overview -->
          <div class="des">
            {{ truncateOverview(item.overview) }}
            <span v-if="item.overview.length > 150">
              <a :href="`/movie/${item.title}`" class="text-yellow-500">See more</a>
            </span>
          </div>
          <div class="btn">
            <button @click="viewTrailer(item.id)">See Trailer</button>
            <button>Rate</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Next/Prev Buttons -->
    <div class="arrows">
      <button class="prev" @click="showSlider('prev')">
        <</button>
          <button class="next" @click="showSlider('next')">></button>

    </div>
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <iframe :src="`https://www.youtube.com/embed/${trailerKey}`" title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      items: [],
      timeRunning: 3000,
      showModal: false,
      trailerKey: '',
    };
  },
  computed: {
    // Truncate overview text to a maximum of 150 characters
    truncateOverview() {
      return (overview) => {
        const maxLength = 150;
        if (overview.length > maxLength) {
          return overview.substring(0, maxLength) + '...';
        }
        return overview;
      };
    },
  },
  methods: {
    showSlider(type) {
      const list = this.$el.querySelector(".list");
      const sliderItems = list.querySelectorAll(".item");
      const carousel = this.$el.querySelector(".carousel");

      if (type === "next") {
        list.appendChild(sliderItems[0]);
        carousel.classList.add("next");
      } else {
        list.prepend(sliderItems[sliderItems.length - 1]);
        carousel.classList.add("prev");
      }

      setTimeout(() => {
        carousel.classList.remove("next");
        carousel.classList.remove("prev");
      }, this.timeRunning); 
    },
    fetchNowPlayingMovies() {
      axios
        .get('http://localhost:5001/api/moviesdb/now-playing?page=1')
        .then(async response => {
          const movies = response.data.results.slice(0, 15); // Limit to 15 movies
          this.items = movies.map(movie => {
            const imageUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
            return {
              id: movie.id,
              title: movie.title,
              original_title: movie.original_title,
              overview: movie.overview,
              poster_path: imageUrl,
            };
          });
        })
        .catch(error => {
          console.error('Error fetching now playing movies:', error);
        });
    },
    async viewTrailer(movieId) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/trailers`
        );
        const trailers = response.data;
        if (trailers.length > 0) {
          const trailerKey = trailers[0].key;
          this.showModal = true;
          this.trailerKey = trailerKey;

        } else {
          alert('No trailers available for this movie.');
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
        alert('Failed to fetch trailer.');
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
  mounted() {
    this.fetchNowPlayingMovies();
  },
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

/* Header section */

header {
  width: 100%;
  max-width: 100%;
  padding-left: 100px;
  height: 50px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1000;
}

header nav a {
  color: #fff;
  margin-right: 5px;
  padding: 5px 10px;
  font-size: 16px;
  transition: 0.2s;
  text-decoration: none;
}

a.active {
  background: #ffd700;
  border-radius: 2px;
}

a:hover {
  background: #ffd700;
  border-radius: 2px;
}

/* Carousel Section */
.carousel {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* Responsive Background Image Adjustments */
@media screen and (max-width: 999px) {
  .carousel {
    background-size: contain;
    /* Ensures the background image is fully visible */
  }
}

@media screen and (max-width: 690px) {
  .carousel {
    background-size: contain;
    /* Same as above for smaller screens */
  }
}

/* Ensure items are in a row */
.carousel .list {
  display: flex;
  /* This arranges items next to each other */
  overflow: hidden;
  /* Hide the overflow for sliding effect */
  transition: transform 0.5s ease-in-out;
  /* Smooth sliding effect */
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
  position: relative;
  /* Ensure text content stays above the shadow */
  z-index: 2;
  /* Text will be on top of the shadow */
  padding: 20px;
  color: white;
  /* Ensure text is readable depending on your design */
}

.list {
  display: flex;
  /* Ensures the items are arranged in a row */
  overflow: hidden;
  /* Hides any overflowing content */
  transition: transform 0.5s ease-in-out;
  /* Smooth sliding effect */
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

.content .title {
  font-size: 90px;
  text-transform: uppercase;
  color: #ffd700;
  font-weight: bold;
  line-height: 1;

  opacity: 0;
  animation: animate 1s ease-in-out 0.3s 1 forwards;
}

.content .name {
  font-size: 90px;
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

/* next prev arrows */

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


/* Responsive Design */

@media screen and (max-width: 999px) {
  header {
    padding-left: 50px;
  }

  .list .item .content {
    left: 50px;
  }

  .content .title,
  .content .name {
    font-size: 70px;
  }

  .content .des {
    font-size: 16px;
  }
}

@media screen and (max-width: 690px) {
  header nav a {
    font-size: 14px;
    margin-right: 0;
  }

  .list .item .content {
    top: 40%;
  }

  .content .title,
  .content .name {
    font-size: 45px;
  }

  .content .btn button {
    padding: 10px 15px;
    font-size: 14px;
  }
}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #000;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 90%;
  max-width: 1200px;
}

.modal-content iframe {
  width: 100%;
  height: 675px;
  border-radius: 8px;
}


.bg-custom-background {
  background-image: linear-gradient(to right, #0b101a, #1a2b3f);
  background-size: cover;
  background-position: center;
}
</style>
