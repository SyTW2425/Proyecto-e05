import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Movie } from '../../src/models/movieModel';
import { describe, it, beforeAll, afterAll, afterEach, expect } from '@jest/globals';
import { createMovie,
         getMovieByTMDid,
         updateMovie,
         deleteMovie
       } from '../../src/controllers/movieController';


describe('Movie Controller Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Movie.deleteMany({});
  });

  describe('createMovie', () => {

    it('should create a movie', async () => {
      const movie = await createMovie('The Matrix', 1999, 603);
      expect(movie.title).toBe('The Matrix');
      expect(movie.releaseYear).toBe(1999);
      expect(movie.TMDid).toBe(603);
    });

  });

  describe('getMovieByTMDid', () => {

    it('should get a movie by TMDid', async () => {
      await createMovie('The Matrix', 1999, 603);
      const movie = await getMovieByTMDid(603);
      expect(movie?.title).toBe('The Matrix');
      expect(movie?.releaseYear).toBe(1999);
    });

  });

  describe('updateMovie', () => {

    it('should update a movie', async () => {
      await createMovie('The Matrix', 1999, 603);
      const movie = await updateMovie(603, { title: 'The Matrix Reloaded' });
      expect(movie?.title).toBe('The Matrix Reloaded');
    });

  });

  describe('deleteMovie', () => {

    it('should delete a movie', async () => {
      await createMovie('The Matrix', 1999, 603);
      await deleteMovie(603);
      const movie = await getMovieByTMDid(603);
      expect(movie).toBeNull();
    });

  });

});
