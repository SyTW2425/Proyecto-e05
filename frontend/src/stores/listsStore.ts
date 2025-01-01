import { defineStore } from 'pinia';
import { useAlertStore } from './alert';

export const useListStore = defineStore('lists', {
  state: () => ({
    lists: [] as Array<{ id: string; name: string; movies: any[] }>,
    newListName: '',
    showCreateListModal: false,
    showMovieListModal: false,
    selectedList: null as any,
    selectedListMovies: [] as any[],
  }),

  actions: {
    async fetchLists() {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(
          'http://localhost:5001/api/lists/user-lists/' + userId,
        );
        const data = await response.json();

        // Fetch movie posters for each list
        const listsWithImages = await Promise.all(
          data.map(async (list: any) => {
            const moviesWithPosters = await Promise.all(
              list.movies.map(async (movie: any) => {
                const movieResponse = await fetch(
                  `http://localhost:5001/api/moviesdb/movie/${movie.TMDid}/images`,
                );
                const movieData = await movieResponse.json();

                // Get the poster image or use a default if none found
                const moviePoster = `https://image.tmdb.org/t/p/w200${
                  movieData.backdrops?.[0]?.file_path ||
                  movie.poster ||
                  '/default-movie-poster.jpg'
                }`;

                return {
                  ...movie,
                  moviePoster,
                };
              }),
            );

            return {
              id: list._id,
              name: list.name,
              movies: moviesWithPosters,
            };
          }),
        );

        this.lists = listsWithImages;
      } catch (error) {
        console.error(error);
        useAlertStore().error('Failed to fetch lists');
      }
    },

    async fetchUserLists(userId: string) {
      try {
        const response = await fetch(
          'http://localhost:5001/api/lists/user-lists/' + userId,
        );
        const data = await response.json();

        // Fetch movie posters for each list
        const listsWithImages = await Promise.all(
          data.map(async (list: any) => {
            const moviesWithPosters = await Promise.all(
              list.movies.map(async (movie: any) => {
                const movieResponse = await fetch(
                  `http://localhost:5001/api/moviesdb/movie/${movie.TMDid}/images`,
                );
                const movieData = await movieResponse.json();

                // Get the poster image or use a default if none found
                const moviePoster = `https://image.tmdb.org/t/p/w200${
                  movieData.backdrops?.[0]?.file_path ||
                  movie.poster ||
                  '/default-movie-poster.jpg'
                }`;

                return {
                  ...movie,
                  moviePoster,
                };
              }),
            );

            return {
              id: list._id,
              name: list.name,
              movies: moviesWithPosters,
            };
          }),
        );

        return listsWithImages;
      } catch (error) {
        console.error(error);
        useAlertStore().error('Failed to fetch lists');
      }
    },
    async createList() {
      if (!this.newListName.trim()) {
        useAlertStore().error('List name cannot be empty');
        return;
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        useAlertStore().error('User not logged in');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/lists/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.newListName,
            userId,
          }),
        });

        if (!response.ok) {
          useAlertStore().error('Error creating list');
        } else {
          const newList = await response.json();
          this.lists.push({
            id: newList._id,
            name: newList.name,
            movies: [],
          });

          this.newListName = '';
          this.showCreateListModal = false;
          useAlertStore().success('List created');
        }
      } catch (error) {
        console.error(error);
        useAlertStore().error('An error occurred while creating the list.');
      }
    },
    async deleteList(listId: string) {
      try {
        await fetch(`http://localhost:5001/api/lists/delete/${listId}`, {
          method: 'DELETE',
        });

        this.lists = this.lists.filter((list) => list.id !== listId);
        useAlertStore().success('List deleted');
      } catch (error) {
        console.error(error);
        useAlertStore().error('An error occurred while deleting the list.');
      }
    },
    async deleteMovie(listId: string, movieId: string) {
      try {
        const response = await fetch(
          'http://localhost:5001/api/lists/remove-movie',
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              listId,
              movieId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to delete the movie');
        }

        // Update the local state to remove the deleted movie
        this.selectedListMovies = this.selectedListMovies.filter(
          (movie) => movie._id !== movieId,
        );

        // Update the corresponding list's movies
        const listIndex = this.lists.findIndex((list) => list.id === listId);
        if (listIndex !== -1) {
          this.lists[listIndex].movies = this.lists[listIndex].movies.filter(
            (movie) => movie._id !== movieId,
          );
        }

        // Notify user
        useAlertStore().success('Movie removed from list');
      } catch (error) {
        console.error(error);
        useAlertStore().error('An error occurred while deleting the movie.');
      }
    },
    showListMovies(list: any) {
      this.selectedList = list;
      this.selectedListMovies = list.movies;
      this.showMovieListModal = true;
    },
    closeModal() {
      this.showMovieListModal = false;
      this.showCreateListModal = false;
    },
    selectList(listId: string, movie: any, closeDropdown: () => void) {
      this.selectedList = this.lists.find((list) => list.id === listId);
      this.selectedListMovies = this.selectedList.movies;

      this.addToList(movie);

      closeDropdown();
    },

    async addToList(movie: any) {
      if (!this.selectedList.id) {
        useAlertStore().error('Please select a list to add the movie to.');
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
              listId: this.selectedList.id,
              title: movie.title,
              releaseYear: movie.release_date.split('-')[0],
              TMDid: movie.id,
              poster: movie.poster_path,
            }),
          },
        );

        if (response.ok) {
          this.fetchLists();
          useAlertStore().success('Movie added to list');
        } else {
          console.error('Failed to add movie to list');
          useAlertStore().error('Failed to add movie to list');
        }
      } catch (error) {
        console.error('Error adding movie to list:', error);
        useAlertStore().error('Error adding movie to list');
      }
    },
  },
});
