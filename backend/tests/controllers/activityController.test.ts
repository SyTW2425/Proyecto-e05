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
import { logActivity } from '../../src/controllers/activityController';

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
    await List.deleteMany({});
    await Review.deleteMany({});
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
      const reviewPayload = {
        title: 'Test Review',
        body: 'Test Review Body',
        rating: 5,
        userId: user._id.toString(),
        movieId: 597,
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
      await request(app).put(`/api/users/follow`).send(followPayload);
      const res = await request(app).get(`/api/activity/user/${user._id.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].type).toBe(ActivityType.FOLLOW);
    });

    it('should get user and following activities: add to list', async () => {
      const user3 = new User({
        name: 'Test User 3',
        username: 'testuser3',
        email: 'testuser3@example.com',
        password: 'testuser3password',
      });
      await user3.save();
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
        TMDid: '597',
      };
      await request(app).post('/api/lists/add-movie').send(moviePayload);
      const followPayload = {
        userId: user._id.toString(),
        followId: user3._id.toString(),
      };
      await request(app).put(`/api/users/follow`).send(followPayload);
      const listPayload2 = {
        name: 'Test List 2',
        userId: user3._id.toString(),
      };
      await request(app).post('/api/lists/create').send(listPayload2);
      const list2 = await List.findOne({ name: 'Test List 2' });
      const moviePayload2 = {
        listId: list2?._id.toString(),
        title: 'Test Movie 2',
        releaseYear: '2021',
        TMDid: '597',
      };
      await request(app).post('/api/lists/add-movie').send(moviePayload2);
      const res = await request(app).get(`/api/activity/all/${user._id.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0].type).toBe(ActivityType.ADD_TO_LIST);
      expect(res.body[1].type).toBe(ActivityType.FOLLOW);
      expect(res.body[2].type).toBe(ActivityType.ADD_TO_LIST);
    });

    it('should get user and following activities: review', async () => {
      const user2 = await User.findOne({ username: 'testuser2' });
      const user3 = await User.findOne({ username: 'testuser3' });
      const reviewPayload = {
        title: 'Test Review',
        body: 'Test Review Body',
        rating: 5,
        userId: user._id.toString(),
        movieId: 597,
      };
      const reviewPayload2 = {
        title: 'Test Review',
        body: 'Test Review Body',
        rating: 5,
        userId: user2?._id.toString(),
        movieId: 587,
      };
      const reviewPayload3 = {
        title: 'Test Review 2',
        body: 'Test Review Body 2',
        rating: 4,
        userId: user3?._id.toString(),
        movieId: 597,
      };
      await request(app).post('/api/reviews/add-review').send(reviewPayload);
      await request(app).post('/api/reviews/add-review').send(reviewPayload2);
      await request(app).post('/api/reviews/add-review').send(reviewPayload3);
      const res = await request(app).get(`/api/activity/all/${user._id.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0].type).toBe(ActivityType.REVIEW);
      expect(res.body[1].type).toBe(ActivityType.REVIEW);
      expect(res.body[2].type).toBe(ActivityType.REVIEW);
    });

    it('should get user and following activities: follow', async () => {
      const user2 = await User.findOne({ username: 'testuser2' });
      const user3 = await User.findOne({ username: 'testuser3' });
      const followPayload = {
        userId: user2?._id.toString(),
        followId: user3?._id.toString(),
      };
      const followPayload2 = {
        userId: user3?._id.toString(),
        followId: user2?._id.toString(),
      };
      await request(app).put(`/api/users/follow`).send(followPayload);
      await request(app).put(`/api/users/follow`).send(followPayload2);
      const res = await request(app).get(`/api/activity/all/${user._id.toString()}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].type).toBe(ActivityType.FOLLOW);
      expect(res.body[1].type).toBe(ActivityType.FOLLOW);
    });

  });

  describe('logActivity', () => {
    it('should log activity', async () => {
      const activityPayload = {
        user: user._id.toString(),
        type: ActivityType.ADD_TO_LIST,
        list: 'Test List',
        movie: 'Test Movie',
      };
      await logActivity(user._id.toString(), ActivityType.FOLLOW, { followed: user._id.toString() });
      const activity = await Activity.findOne({ user: user._id.toString() });
      expect(activity).not.toBeNull();
      expect(activity?.type).toBe(ActivityType.FOLLOW);
      expect(activity?.followed?.toString()).toBe(user._id.toString());
    });
  });

  describe('GET /activity error handling', () => {
    it('should return 500 if user is not valid', async () => {
      const res = await request(app).get(`/api/activity/user/123`);
      expect(res.status).toBe(500);
    });

    it('should return 500 if user is not valid', async () => {
      const res = await request(app).get(`/api/activity/all/123`);
      expect(res.status).toBe(500);
    });
  });

});
