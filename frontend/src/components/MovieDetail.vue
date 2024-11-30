<template>
  <div v-if="movie" class="movie-detail">
    <!-- Movie Title and Rating -->
    <div class="movie-header">
      <div class="ipc-title">
        <a :href="`/title/${movie.id}/?ref_=fea_em00070_1_title_sm`" class="ipc-title-link-wrapper" tabindex="0" target="_top">
          <h3 class="ipc-title__text">{{ movie.title }}</h3>
        </a>
      </div>
      <div class="movie-rating">
        <span class="ipc-rating-star">
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="presentation">
            <path d="M12 20.1l5.82 3.682c1.066.675 2.37-.322 2.09-1.584l-1.543-6.926 5.146-4.667c.94-.85.435-2.465-.799-2.567l-6.773-.602L13.29.89a1.38 1.38 0 0 0-2.581 0l-2.65 6.53-6.774.602C.052 8.126-.453 9.74.486 10.59l5.147 4.666-1.542 6.926c-.28 1.262 1.023 2.26 2.09 1.585L12 20.099z"></path>
          </svg>
          {{ movie.vote_average }} / 10
        </span>
      </div>
    </div>

    <!-- Movie Description -->
    <div class="movie-description">
      <h3>In theaters {{ movie.release_date }}</h3>
      <p>{{ movie.overview }}</p>
    </div>

    <!-- Cast Section -->
    <div class="movie-cast">
      <h3>Cast</h3>
      <div class="cast-list">
        <div v-for="castMember in cast" :key="castMember.id" class="cast-item">
          <img :src="castMember.profile_path
            ? `https://image.tmdb.org/t/p/w500${castMember.profile_path}`
            : '/default-avatar.png'" :alt="castMember.name" class="cast-avatar"/>
          <a :href="`/name/${castMember.id}`" class="cast-name">{{ castMember.name }}</a>
          <p>{{ castMember.character }}</p>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="movie-reviews">
      <h3>Reviews</h3>
      <div v-if="reviews.length > 0">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <p><strong>{{ review.author }}</strong>: {{ review.content }}</p>
        </div>
      </div>
      <p v-else>No reviews available for this movie.</p>
    </div>

    <!-- Watchlist and Trailer Button -->
    <div class="movie-actions">
      <button @click="viewTrailer" v-if="trailerKey">Watch Trailer</button>
      <button @click="addToWatchlist">Add to Watchlist</button>
    </div>

    <!-- Modal for Trailer -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <iframe :src="`https://www.youtube.com/embed/${trailerKey}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
  </div>

  <div v-else class="loading">Loading...</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      movie: null,
      cast: [],
      reviews: [],
      showModal: false,
      trailerKey: '',
    };
  },
  methods: {
    async fetchMovieData() {
      const movieId = this.$route.params.id;
      try {
        const movieResponse = await axios.get(`http://localhost:5001/api/moviesdb/movie/${movieId}`);
        this.movie = movieResponse.data;

        const castResponse = await axios.get(`http://localhost:5001/api/moviesdb/movie/${movieId}/credits`);
        this.cast = castResponse.data.cast;

        const reviewsResponse = await axios.get(`http://localhost:5001/api/moviesdb/movie/${movieId}/reviews`);
        this.reviews = reviewsResponse.data.results;

        const trailersResponse = await axios.get(`http://localhost:5001/api/moviesdb/movie/${movieId}/trailers`);
        const trailers = trailersResponse.data;
        if (trailers.length > 0) {
          this.trailerKey = trailers[0].key;
        } else {
          this.trailerKey = '';
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    },
    viewTrailer() {
      if (this.trailerKey) {
        this.showModal = true;
      } else {
        alert('No trailer available for this movie.');
      }
    },
    addToWatchlist() {
      alert('Added to watchlist');
    },
    closeModal() {
      this.showModal = false;
    },
  },
  watch: {
    '$route.params.id': 'fetchMovieData',
  },
  mounted() {
    this.fetchMovieData();
  },
};
</script>

<style scoped>
.movie-detail {
  padding: 20px;
}

.movie-header {
  display: flex;
  justify-content: space-between;
}

.ipc-title__text {
  font-size: 24px;
  font-weight: bold;
}

.movie-rating {
  display: flex;
  align-items: center;
}

.movie-description {
  margin-top: 20px;
}

.movie-cast {
  margin-top: 30px;
}

.cast-list {
  display: flex;
  flex-wrap: wrap;
}

.cast-item {
  margin-right: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.cast-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.movie-reviews {
  margin-top: 30px;
}

.movie-actions {
  margin-top: 20px;
}

.movie-actions button {
  padding: 10px 20px;
  background-color: #ffd700;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.movie-actions button:hover {
  background-color: #e6c200;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  width: 90%;
  max-width: 1200px;
}

.modal-content iframe {
  width: 100%;
  height: 675px;
  border-radius: 8px;
}

.loading {
  font-size: 24px;
  text-align: center;
  margin-top: 50px;
}
</style>
