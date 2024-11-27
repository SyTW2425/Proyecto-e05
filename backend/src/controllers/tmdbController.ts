import axios from 'axios';
import { url } from 'inspector';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const getAuthHeaders = () => ({
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`,
});

// Search for movies by title, defaults to first page of results
export const searchMovies = async (query: string, page: number = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        query,
        include_adult: false,
        language: 'en-US',
        page,
      },
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
};

// Get the latest movies from this year most popular
export const getPopularMovies = async (page: number = 1) => {
  const currentYear = new Date().getFullYear(); // Get the current year
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        sort_by: 'popularity.desc',
        include_adult: false,
        language: 'en-US',
        page,
        primary_release_year: currentYear,
        page_size: 20,
      },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching most popular movies:', error);
    throw error;
  }
};

// Movies that are now in theatres
export const getNowPlayingMovies = async (page: number = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        language: 'en-US',
        page,
      },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};

// get genres
export const getGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};



