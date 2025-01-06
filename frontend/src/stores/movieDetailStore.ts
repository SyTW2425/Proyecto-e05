import { defineStore } from 'pinia';
import { useAlertStore } from './alert';
import axios from 'axios';

export const useMovieDetailStore = defineStore('movieDetail', {
  state: () => ({
    movie: null as any,
    cast: [] as Array<any>,
    similarMovies: [] as Array<any>,
    reviews: [] as Array<any>,
    images: [] as Array<any>,
    videos: [] as Array<any>,
    showModal: false,
    trailerKey: '',
    selectedImagePath: '',
    showImageModal: false,
    showReviewModal: false,
    selectedReview: null as any,
    movieBackgroundStyle: {
      backgroundImage: 'none',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      filter: 'brightness(35%)',
    },
    isDropdownOpen: false,
    openRatePopup: false,
    userReview: '',
    userRating: null as number | null,
    reviewForm: {
      title: '',
      body: '',
      rating: 0,
    },
    userLists: [] as Array<any>,
    selectedListId: null as string | null,
  }),

  actions: {
    async fetchMovieData(movieId: string | string[]) {
      try {
        const { data: movie } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}`,
        );
        this.movie = movie;

        const { data: credits } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/credits`,
        );
        this.cast = credits.cast;

        const { data: images } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/images`,
        );
        this.images = images;

        const { data: videos } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/videos`,
        );
        this.videos = videos.results;

        if (images.backdrops.length) {
          const backdrop = images.backdrops[0].file_path;
          this.movieBackgroundStyle = {
            backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            filter: 'brightness(35%)',
          };

        } else {
          this.movieBackgroundStyle.backgroundImage =
            'linear-gradient(to right, #0b101a, #1a2b3f)';
        }

        const { data: similarMovies } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/similar`,
        );
        this.similarMovies = similarMovies || [];

        const { data: reviews } = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/reviews`,
        );
        this.reviews = reviews.results || [];
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    },

    toggleRatePopup() {
      this.openRatePopup = !this.openRatePopup;
    },

    closeRatePopup() {
      this.openRatePopup = false;
      this.userReview = '';
      this.userRating = 0;
    },

    async viewImage(imagePath: string) {
      this.selectedImagePath = imagePath;
      this.showImageModal = true;
    },

    async viewVideo(videoKey: string) {
      this.showModal = true;
      this.trailerKey = videoKey;
    },

    async viewTrailer(movieId: string) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/moviesdb/movie/${movieId}/trailers`,
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

    rateMovie(movieId: string) {
      alert(`Rated movie with ID: ${movieId}`);
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    closeModal() {
      this.showModal = false;
    },

    closeImageModal() {
      this.showImageModal = false;
    },

    openReviewModal(review: any) {
      this.selectedReview = review;
      this.showReviewModal = true;
    },

    closeReviewModal() {
      this.showReviewModal = false;
      this.selectedReview = null;
    },

    async fetchLists() {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(
          `http://localhost:5001/api/lists/user-lists/${userId}`,
        );
        const data = await response.json();
        this.userLists = data;
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    },

    selectList(listId: string) {
      this.selectedListId = listId;
      this.isDropdownOpen = false;
    },

    async addToList() {
      if (!this.selectedListId) {
        const alertStore = useAlertStore();
        alertStore.error('Please select a list to add the movie to.');
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5001/api/lists/add-movie`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              listId: this.selectedListId,
              title: this.movie.title,
              releaseYear: this.movie.release_date.split('-')[0],
              TMDid: this.movie.id,
            }),
          },
        );

        if (response.ok) {
          this.fetchLists();
        } else {
          console.error('Failed to add movie to list');
        }
      } catch (error) {
        console.error('Error adding movie to list:', error);
      }
    },
  },
});
