import { defineStore } from 'pinia';
import { useAlertStore } from './alert';
import { useMovieDetailStore } from './movieDetailStore';

export const useReviewStore = defineStore('reviews', {
  state: () => ({
    reviews: [] as Array<{
      id: string;
      movieId: string;
      movieTitle: string;
      rating: number;
      body: string;
      moviePoster: string;
    }>,
    newReviewTitle: '',
    newReviewContent: '',
    newReviewRating: 0,
    newReviewMovieId: '',
    showCreateReviewModal: false,
    showReviewModal: false,
    selectedReview: null as any,
    selectedReviewContent: '',
    showModalReview: false,
    showReviewPopup: false,
  }),

  actions: {
    async fetchReviews() {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(
          'http://localhost:5001/api/reviews/user/reviews?userId=' + userId,
        );
        const data = await response.json();

        const reviewsWithImages = await Promise.all(
          data.map(async (review: any) => {
            const movieResponse = await fetch(
              `http://localhost:5001/api/moviesdb/movie/${review.movie.TMDid}/images`,
            );
            const movieData = await movieResponse.json();

            const moviePoster = `https://image.tmdb.org/t/p/w200${
              movieData.backdrops?.[0]?.file_path || '/default-movie-poster.jpg'
            }`;

            console.log('REV: ', review);

            return {
              _id: review._id,
              movieId: review.movie.TMDid,
              movieTitle: review.movie.title,
              rating: review.rating,
              body: review.body,
              moviePoster,
            };
          }),
        );

        this.reviews = reviewsWithImages;
      } catch (error) {
        console.error(error);
        useAlertStore().error('Failed to fetch reviews');
      }
    },
    async createReview() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          useAlertStore().error('You must be logged in to create a review');
          return;
        }

        const userId = localStorage.getItem('userId');
        if (!userId) {
          useAlertStore().error('User not logged in');
          return;
        }

        const reviewData = {
          title: useMovieDetailStore().movie.title,
          body: this.newReviewContent,
          rating: this.newReviewRating,
          userId: userId,
          movieId: this.newReviewMovieId,
        };

        console.log('Review data:', reviewData);

        const response = await fetch(
          'http://localhost:5001/api/reviews/add-review',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reviewData),
          },
        );

        if (!response.ok) {
          useAlertStore().error('Failed to create review');
          return;
        }

        useAlertStore().success('Review created successfully');
        this.fetchReviews();
        this.closeModalReview();
      } catch (error) {
        console.error(error);
        useAlertStore().error('Failed to create review');
      }
    },
    removeReview(reviewId: any) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          useAlertStore().error('You must be logged in to delete a review');
          return;
        }

        console.log('Deleting review:', reviewId._id);

        fetch(`http://localhost:5001/api/reviews/review/${reviewId._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              useAlertStore().error('Failed to delete review');
              return;
            }

            // Remove the deleted review from the local reviews state using _id
            this.reviews = this.reviews.filter(
              (review) => review._id !== reviewId._id, // Correct comparison
            );

            useAlertStore().success('Review deleted successfully');
          })
          .catch((error) => {
            console.error(error);
            useAlertStore().error('Failed to delete review');
          });
      } catch (error) {
        console.error(error);
        useAlertStore().error('Failed to delete review');
      }
    },
    showReviewPopup(review: any) {
      this.selectedReview = review;
      this.showModalReview = true;
    },
    closeModalReview() {
      this.showModalReview = false;
    },
    showMovieReviewModal(review: any) {
      this.selectedReview = review;
      this.showReviewModal = true;
    },
    setReviewMovieId(movieId: string) {
      this.newReviewMovieId = movieId;
    },
    toggleRateAndSetReviewMovieId() {
      useMovieDetailStore().toggleRatePopup();
      this.setReviewMovieId(useMovieDetailStore().movie.id);
    },
    handleSubmit() {
      this.createReview();
      useMovieDetailStore().toggleRatePopup();
    },
  },
});
