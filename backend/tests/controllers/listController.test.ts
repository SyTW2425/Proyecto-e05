import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/app';
import { List } from '../../src/models/listModel';
import { User } from '../../src/models/userModel';
import { bcrypt } from 'bcrypt';
import { describe, it, beforeAll, afterAll, afterEach, expect } from '@jest/globals';
import { userInfo } from 'os';

describe('List Controller Tests', () => {
  let mongoServer: MongoMemoryServer;
  let user;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(uri);

    user = new User({
      name: 'Test User',
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: 'testuserpassword',
    });

  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await List.deleteMany({});
  });

  describe('POST /create', () => {
    it('should create a new list successfully', async () => {
      const listPayload = {
        name: 'Test List',
        userId: user._id.toString(),
      };

      const res = await request(app).post('/api/lists/create').send(listPayload);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Test List');

      const list = await List.findOne({ name: 'Test List' });

      expect(list).toBeTruthy();
      expect(list?.user.toString()).toBe(user._id.toString());
    });

    it('should not create a list without a name', async () => {
      const listPayload = {
        userId: user._id.toString(),
      };

      const res = await request(app).post('/api/lists/create').send(listPayload);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error creating list');
    });

  });

  describe('GET /user-lists/:userId', () => {

    it('should get all lists for a user', async () => {
      const list1 = new List({
        name: 'Test List 1',
        user: user._id,
      });
      await list1.save();

      const list2 = new List({
        name: 'Test List 2',
        user: user._id,
      });
      await list2.save();

      const res = await request(app).get('/api/lists/user-lists/' + user._id);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should return an empty array if user has no lists', async () => {
      const res = await request(app).get('/api/lists/user-lists/' + user._id);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });

    it('should return an error if the userId is invalid', async () => {
      const res = await request(app).get('/api/lists/user-lists/123');

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid userId format');
    });

  });

});