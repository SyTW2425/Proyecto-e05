import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {app} from '../../src/app'; 
import { Review } from '../../src/models/reviewModel';
import { User } from '../../src/models/userModel';
import { describe, it, beforeAll, afterAll, afterEach, expect, test } from '@jest/globals';
import { getReviewsByUserId,
         updateReview,
         deleteReview,
       } from '../../src/controllers/reviewController';


describe('User Controller Tests', () => {
  let mongoServer: MongoMemoryServer;
  let testUser;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(uri);

    testUser = new User({
      name: 'Test User',
      username: 'testUser',
      password: 'password',
      email: 'testuser@example.com',
    });
    await testUser.save();

  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Review.deleteMany({});
  });

  describe('getReviewsByUserId', () => {

    it('should return all reviews of a user given its id', async () => {
      const review1 = new Review({
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        user: testUser._id,
        movie: {
          title: 'Movie Title',
          releaseYear: '2021',
          TMDid: 1,
        },
      });
      await review1.save();
      const review2 = new Review({
        title: 'Review 2',
        body: 'This is another review',
        rating: 3,
        user: testUser._id,
        movie: {
          title: 'Another Movie',
          releaseYear: '2021',
          TMDid: 2,
        },
      });
      await review2.save();
      const reviews = await getReviewsByUserId(testUser._id);
      expect(reviews.length).toBe(2);
      expect(reviews[0].title).toBe('Review 1');
      expect(reviews[1].title).toBe('Review 2');
    });

  });

  describe('updateReview', () => {

    it('should update a review given its id', async () => {
      const review = new Review({
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        user: testUser._id,
        movie: {
          title: 'Movie Title',
          releaseYear: '2021',
          TMDid: 1,
        },
      });
      await review.save();
      const updatedReview = await updateReview(review._id, { title: 'Updated Review' });
      expect(updatedReview?.title).toBe('Updated Review');
    });

  });

  describe('deleteReview', () => {

    it('should delete a review given its id', async () => {
      const review = new Review({
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        user: testUser._id,
        movie: {
          title: 'Movie Title',
          releaseYear: '2021',
          TMDid: 1,
        },
      });
      await review.save();
      const deletedReview = await deleteReview(review._id);
      expect(deletedReview?.title).toBe('Review 1');
      const reviews = await getReviewsByUserId(testUser._id);
      expect(reviews.length).toBe(0);
    });

  });

  describe('POST /add-review', () => {

    it('should add a review to a movie', async () => {
      const reviewPayload = {
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        userId: testUser._id,
        movieId: '597',
      };
      const response = await request(app)
        .post('/api/reviews/add-review')
        .send(reviewPayload);
      expect(response.status).toBe(201);
      const review = await Review.findOne({ title: 'Review 1' });
      expect(review).not.toBeNull();
      expect(review?.user).toEqual(testUser._id);
      expect(review?.movie?.TMDid).toBe('597');
    });

    it('should update a review if it already exists', async () => {
      const review = new Review({
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        user: testUser._id,
        movie: {
          title: 'Movie Title',
          releaseYear: '2021',
          TMDid: '597',
        },
      });
      await review.save();
      const reviewPayload = {
        title: 'Updated Review',
        body: 'This is an updated review',
        rating: 5,
        userId: testUser._id,
        movieId: '597',
      };
      const response = await request(app)
        .post('/api/reviews/add-review')
        .send(reviewPayload);
      expect(response.status).toBe(200);
      const updatedReview = await Review.findOne({ title: 'Updated Review' });
      expect(updatedReview).not.toBeNull();
      expect(updatedReview?.user).toEqual(testUser._id);
      expect(updatedReview?.movie?.TMDid).toBe('597');
    });

    it('should return error if user not found', async () => {
      const reviewPayload = {
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        userId: new mongoose.Types.ObjectId(),
        movieId: '597',
      };
      const response = await request(app)
        .post('/api/reviews/add-review')
        .send(reviewPayload);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return error if movieId is not correct', async () => {
      const reviewPayload = {
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        userId: testUser._id,
        movieId: 'hola',
      };
      const response = await request(app)
        .post('/api/reviews/add-review')
        .send(reviewPayload);
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error adding review to movie');
    });

  });

  describe('GET /user/reviews', () => {

    it('should return all reviews of a user', async () => {
      const review1 = new Review({
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        user: testUser._id,
        movie: {
          title: 'Movie Title',
          releaseYear: '2021',
          TMDid: 1,
        },
      });
      await review1.save();
      const review2 = new Review({
        title: 'Review 2',
        body: 'This is another review',
        rating: 3,
        user: testUser._id,
        movie: {
          title: 'Another Movie',
          releaseYear: '2021',
          TMDid: 2,
        },
      });
      await review2.save();
      const response = await request(app)
        .get(`/api/reviews/user/reviews?userId=${testUser._id}`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Review 1');
      expect(response.body[1].title).toBe('Review 2');
    });

    it('should return an error if no userId is provided', async () => {
      const response = await request(app)
        .get(`/api/reviews/user/reviews`);
      expect(response.status).toBe(500);
    });

  });

  describe('PUT /review/:reviewId', () => {

    it('should update a review given its id', async () => {
      const review = new Review({
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        user: testUser._id,
        movie: {
          title: 'Movie Title',
          releaseYear: '2021',
          TMDid: 1,
        },
      });
      await review.save();
      const response = await request(app)
        .put(`/api/reviews/review/${review._id}`)
        .send({ title: 'Updated Review' });
      expect(response.status).toBe(200);
      const updatedReview = await Review.findById(review._id);
      expect(updatedReview?.title).toBe('Updated Review');
    });

    it('should return an error if review not found', async () => {
      const response = await request(app)
        .put(`/api/reviews/review/${new mongoose.Types.ObjectId()}`)
        .send({ title: 'Updated Review' });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Review not found');
    });

    it('should return an error if reviewId is not correct', async () => {
      const response = await request(app)
        .put(`/api/reviews/review/hola`)
        .send({ title: 'Updated Review' });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error updating review');
    });

  });

  describe('DELETE /review/:reviewId', () => {

    it('should delete a review given its id', async () => {
      const review = new Review({
        title: 'Review 1',
        body: 'This is a review',
        rating: 4,
        user: testUser._id,
        movie: {
          title: 'Movie Title',
          releaseYear: '2021',
          TMDid: 1,
        },
      });
      await review.save();
      const response = await request(app)
        .delete(`/api/reviews/review/${review._id}`);
      expect(response.status).toBe(200);
      const deletedReview = await Review.findById(review._id);
      expect(deletedReview).toBeNull();
    });

    it('should return an error if review not found', async () => {
      const response = await request(app)
        .delete(`/api/reviews/review/${new mongoose.Types.ObjectId()}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Review not found');
    });

    it('should return an error if reviewId is not correct', async () => {
      const response = await request(app)
        .delete(`/api/reviews/review/hola`);
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error deleting review');
    });

  });

});
