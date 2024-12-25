import axios from 'axios';
import { defineStore } from 'pinia';

export const useCarouselStore = defineStore('carousel', {
  state: () => ({
    showModal: false,
    trailerKey: '',
    items: [] as Array<any>,
  }),

  actions: {
    fetchNowPlayingMovies() {
      axios
        .get('http://localhost:5001/api/moviesdb/now-playing?page=1')
        .then(async (response) => {
          const movies = response.data.results.slice(0, 20);
          this.items = movies.map((movie: any) => {
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
        .catch((error) => {
          console.error(error);
        });
    },
    truncateOverview(overview: string) {
      return overview.length > 200 ? overview.slice(0, 200) + '...' : overview;
    },
    resizeTitle(title: string) {
      // change font size based on title length
      console.log(title, title.length);
      if (title.length > 15 && title.length < 30) {
        return { fontSize: '50px' };

      } else if (title.length > 30) {
        return { fontSize: '40px' };
      } else {
        return { fontSize: '90px' };
      }
    }
  },
});
