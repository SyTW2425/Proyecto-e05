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
export const getPopularMovies = async (page: number = 1, year?: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        sort_by: 'popularity.desc',
        include_adult: false,
        language: 'en-US',
        page,
        page_size: 20,
        primary_release_year: year,
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

// Get movies with specifics genres (one or more genres)
export const getMoviesByGenres = async (
  genreIds: number[],
  page: number = 1,
  year?: number,
) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        with_genres: genreIds.join(','),
        include_adult: false,
        page: page,
        primary_release_year: year,
      },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

// Get movie trailers
export const getMovieTrailers = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        language: 'en-US',
      },
      headers: getAuthHeaders(),
    });
    const trailers = response.data.results.filter(
      (video: any) => video.type === 'Trailer',
    );
    return trailers;
  } catch (error) {
    console.error('Error fetching movie trailers:', error);
    throw error;
  }
};

// Get cast and crew
export const getMovieCredits = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
};

// Get movie images
export const getMovieImages = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/images`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie images:', error);
    throw error;
  }
};

export const getMovieReviews = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/reviews`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    throw error;
  }
};

// get similar movies
export const getSimilarMovies = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
      headers: getAuthHeaders(),
    });

    // Sort movies by release date (newest first)
    const sortedMovies = response.data.results.sort(
      (a: { release_date: string }, b: { release_date: string }) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime(),
    );

    return sortedMovies;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    throw error;
  }
};

export const getMovieVideos = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error;
  }
};
