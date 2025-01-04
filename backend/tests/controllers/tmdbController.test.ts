import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getNowPlayingMovies,
  getGenres,
  getMoviesByGenres,
  getMovieTrailers,
  getMovieCredits,
  getMovieImages,
} from '../../src/controllers/tmdbController';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockResponse = (data: any) => ({ data });

describe('Movie API Functions', () => {
  const API_KEY = process.env.TMDB_API_KEY;

  beforeEach(() => {
    jest.clearAllMocks(); // Clears any mocked calls before each test
  });

  describe('searchMovies', () => {
    
    it('should return movies by search query', async () => {
      const mockData = { results: [{ title: 'Gladiator' }] };
      mockedAxios.get.mockResolvedValue(mockResponse(mockData));
      const query = 'Gladiator';
      const result = await searchMovies(query);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/search/movie',
        {
          params: {
            query,
            include_adult: false,
            language: 'en-US',
            page: 1,
          },
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockData);
    });

  });

  describe('getMovieDetails', () => {

    it('should return movie details by ID', async () => {
      const movieId = 12345;
      const mockData = { id: movieId, title: 'Gladiator' };
      mockedAxios.get.mockResolvedValue(mockResponse(mockData));

      const result = await getMovieDetails(movieId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockData);
    });

  });

  describe('getPopularMovies', () => {

    it('should return popular movies for the current year', async () => {
      const mockData = { results: [{ title: 'Popular Movie' }] };
      mockedAxios.get.mockResolvedValue(mockResponse(mockData));

      const result = await getPopularMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/discover/movie',
        {
          params: {
            sort_by: 'popularity.desc',
            include_adult: false,
            language: 'en-US',
            page: 1,
            page_size: 20,
          },
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockData);
    });

  });

  describe('getNowPlayingMovies', () => {

    it('should return now playing movies', async () => {
      const mockData = { results: [{ title: 'Now Playing Movie' }] };
      mockedAxios.get.mockResolvedValue(mockResponse(mockData));
      const result = await getNowPlayingMovies();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/now_playing',
        {
          params: {
            language: 'en-US',
            page: 1,
          },
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockData);
    });

  });

  describe('getGenres', () => {

    it('should return movie genres', async () => {
      const mockData = { genres: [{ id: 1, name: 'Action' }] };
      mockedAxios.get.mockResolvedValue(mockResponse(mockData));
      const result = await getGenres();
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/genre/movie/list',
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockData);
    });

  });

  describe('getMoviesByGenres', () => {

    it('should return movies by genre', async () => {
      const genreId = 1;
      const mockData = { results: [{ title: 'Action Movie' }] };
      mockedAxios.get.mockResolvedValue(mockResponse(mockData));
      const result = await getMoviesByGenres([genreId]);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/discover/movie`,
        {
          params: {
            page: 1,
            with_genres: genreId.toString(),
            include_adult: false,
          },
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockData);
    });

    it('should return movies by genre and page', async () => {
      const genreId = 1;
      const page = 2;
      const mockData = { results: [{ title: 'Action Movie' }] };
      mockedAxios.get.mockResolvedValue(mockResponse(mockData));
      const result = await getMoviesByGenres([genreId], page);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/discover/movie`,
        {
          params: {
            page,
            with_genres: genreId.toString(),
            include_adult: false,
          },
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockData);
    });

  });

  describe('getMovieCredits', () => {

    it ('should return movie credits by ID', async () => {
      const movieId = 12345;
      const mockData = { id: movieId, title: 'Gladiator' };
      mockedAxios.get.mockResolvedValue(mockResponse(mockData));

      const result = await getMovieCredits(movieId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockData);
    }); 

  });

  describe('getMovieImages', () => {

    it ('should return movie images by ID', async () => {
      const movieId = 12345;
      const mockData = { id: movieId, title: 'Gladiator' };
      mockedAxios.get.mockResolvedValue(mockResponse(mockData));

      const result = await getMovieImages(movieId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api.themoviedb.org/3/movie/${movieId}/images`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      );
      expect(result).toEqual(mockData);
    });

  });

});
