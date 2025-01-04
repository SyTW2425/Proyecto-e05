import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {app} from '../../src/app'; 
import { Review } from '../../src/models/reviewModel';
import { describe, it, beforeAll, afterAll, afterEach, expect } from '@jest/globals';
import { createReview,
         getReviewsByUserId,
         updateReview,
         deleteReview,
       } from '../../src/controllers/reviewController';


describe('User Controller Tests', () => {
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
    await Review.deleteMany({});
  });

  describe('createReview', () => {

    it('should create a review', async () => {
      const user = new mongoose.Types.ObjectId();
      const movie = new mongoose.Types.ObjectId();

    });

  });

});
