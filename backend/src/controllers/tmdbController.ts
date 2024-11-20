import axios from 'axios';
import { url } from 'inspector';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const getAuthHeaders = () => ({
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`
});

// Search for movies by title, defaults to first page of results
export const searchMovies = async (query: string, page: number = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page
      },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Get movie details by TMDb ID
export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
};