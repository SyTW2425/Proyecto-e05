import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {app} from '../../src/app'; 
import { Activity } from '../../src/models/activityModel';
import { User } from '../../src/models/userModel';
import { List } from '../../src/models/listModel';
import { Review } from '../../src/models/reviewModel';
import { describe, it, beforeAll, afterAll, afterEach, expect } from '@jest/globals';
import { ActivityType } from '../../src/types/activityType';
import { createMovie } from '../../src/controllers/movieController';

describe('User Controller Tests', () => {
  let mongoServer: MongoMemoryServer;
  let user;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    user = new User({
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: 'testuserpassword',
    });

    await mongoose.connect(uri);

    await user.save();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Activity.deleteMany({});
  });

  describe('GET /activity', () => {
    it('should get user activity: add to list', async () => {
      const listPayload = {
        name: 'Test List',
        userId: user._id.toString(),
      };
      await request(app).post('/api/lists/create').send(listPayload);
      const list = await List.findOne({ name: 'Test List' });
      const moviePayload = {
        listId: list?._id.toString(),
        title: 'Test Movie',
        releaseYear: '2021',
        TMDid: '22',
      }
      await request(app).post('/api/lists/add-movie').send(moviePayload);
      const res = await request(app).get(`/api/activity/user/${user._id.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].type).toBe(ActivityType.ADD_TO_LIST);
    });

    it('should get user activity: review', async () => {
      const movie = await createMovie('Test Movie', 2021, 170);
      const reviewPayload = {
        title: 'Test Review',
        body: 'Test Review Body',
        rating: 5,
        userId: user._id.toString(),
        movieId: movie._id,
      };
      await request(app).post('/api/reviews/add-review').send(reviewPayload);
      const res = await request(app).get(`/api/activity/user/${user._id.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].type).toBe(ActivityType.REVIEW);
    });

    it('should get user activity: follow', async () => {
      const user2 = new User({
        name: 'Test User 2',
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'testuser2password',
      });
      await user2.save();
      const followPayload = {
        userId: user._id.toString(),
        followId: user2._id.toString(),
      };
      await request(app).post(`/api/users/follow`).send(followPayload);
      const res = await request(app).get(`/api/activity/user/${user._id.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].type).toBe(ActivityType.FOLLOW);
    });

  });

});
