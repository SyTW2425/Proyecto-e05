import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {app} from '../../src/app'; 
import { User } from '../../src/models/userModel';
import bcrypt from 'bcrypt';
import { describe, it, beforeAll, afterAll, afterEach, expect } from '@jest/globals';

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
    await User.deleteMany({});
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const userPayload = {
        name: 'Test User',
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
      };

      const res = await request(app).post('/api/users/register').send(userPayload);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');

      const user = await User.findOne({ username: 'testuser' });

      expect(user).toBeTruthy();
      expect(user?.email).toBe('test@example.com');
    });

    it('should not allow duplicate username or email', async () => {
      const existingUser = new User({
        name: 'Existing User',
        username: 'existinguser',
        password: 'hashedPassword',
        email: 'existing@example.com',
      });
      await existingUser.save();

      const duplicatePayload = {
        name: 'Test User',
        username: 'existinguser',
        password: 'password123',
        email: 'test@example.com',
      };

      const res = await request(app).post('/api/users/register').send(duplicatePayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Username or email already exists');
    });
  });

  describe('POST /login', () => {
    it('should login a user successfully and return a token', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: 'Test User',
        username: 'testuser',
        password: hashedPassword,
        email: 'test@example.com',
      });
      await newUser.save();

      const loginPayload = {
        username: 'testuser',
        password: 'password123',
      };

      const res = await request(app).post('/api/users/login').send(loginPayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeTruthy();
    });

    it('should return error for invalid username', async () => {
      const loginPayload = {
        username: 'nonexistentuser',
        password: 'password123',
      };

      const res = await request(app).post('/api/users/login').send(loginPayload);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid username');
    });

    it('should return error for incorrect password', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: 'Test User',
        username: 'testuser',
        password: hashedPassword,
        email: 'test@example.com',
      });
      await newUser.save();

      const loginPayload = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const res = await request(app).post('/api/users/login').send(loginPayload);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Incorrect password');
    });
  });

  describe('PUT /follow', () => {

    it('should allow to follow user', async () => {
      const testUser = new User({
        name: 'Test User',
        username: 'testUser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await testUser.save();
      const followUser = new User({
        name: 'Follow User',
        username: 'followUser',
        password: 'password',
        email: 'followuser@example.com',
      });
      await followUser.save();
      const followPayload = {
        userId: testUser._id,
        followId: followUser._id,
      }
      const res = await request(app).put('/api/users/follow').send(followPayload);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User followed successfully');
      const user = await User.findById(testUser._id);
      const followedUser = await User.findById(followUser._id);
      expect(user?.following.map(id => id.toString())).toContain(followUser._id.toString());
      expect(followedUser?.followers.map(id => id.toString())).toContain(testUser._id.toString());
    });

  });

  describe('PUT /unfollow', () => {

    it('should allow to unfollow a user', async () => {
      const testUser = new User({
        name: 'Test User',
        username: 'testUser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await testUser.save();
      const followUser = new User({
        name: 'Follow User',
        username: 'followUser',
        password: 'password',
        email: 'followuser@example.com',
      });
      await followUser.save();
      const followPayload = {
        userId: testUser._id,
        followId: followUser._id,
      }
      await request(app).put('/api/users/follow').send(followPayload);

      const unfollowPayload = {
        userId: testUser._id,
        unfollowId: followUser._id,
      }
      const res = await request(app).put('/api/users/unfollow').send(unfollowPayload);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User unfollowed successfully');
      const user = await User.findById(testUser._id);
      const followedUser = await User.findById(followUser._id);
      expect(user?.following.length).toBe(0)
      expect(followedUser?.followers.length).toBe(0);
    });

  });

  describe('GET /followers', () => {

    it('should return all the followers of a user', async () => {
      const testUser = new User({
        name: 'Test User',
        username: 'testUser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await testUser.save();
      const follower1 = new User({
        name: 'Follow User',
        username: 'follower1',
        password: 'password',
        email: 'follower1@example.com',
      });
      await follower1.save();
      const follower2 = new User({
        name: 'Follow User',
        username: 'follower2',
        password: 'password',
        email: 'follower2@example.com',
      });
      await follower2.save();
      const follower3 = new User({
        name: 'Follow User',
        username: 'follower3',
        password: 'password',
        email: 'follower3@example.com',
      });
      await follower3.save();
      await request(app).put('/api/users/follow').send({ userId: follower1._id, followId: testUser._id });
      await request(app).put('/api/users/follow').send({ userId: follower2._id, followId: testUser._id });
      await request(app).put('/api/users/follow').send({ userId: follower3._id, followId: testUser._id });
      const res = await request(app).get(`/api/users/followers/${testUser._id}`);
     
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });

  });

  describe('GET /following', () => {

    it('should return the users followed by a given user', async () => {
      const testUser = new User({
        name: 'Test User',
        username: 'testUser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await testUser.save();
      const followed1 = new User({
        name: 'Follow User',
        username: 'followed1',
        password: 'password',
        email: 'followed1@example.com',
      });
      await followed1.save();
      const followed2 = new User({
        name: 'Follow User',
        username: 'followed2',
        password: 'password',
        email: 'followed2@example.com',
      });
      await followed2.save();
      const followed3 = new User({
        name: 'Follow User',
        username: 'followed3',
        password: 'password',
        email: 'followed3@example.com',
      });
      await followed3.save();

      await request(app).put('/api/users/follow').send({ userId: testUser._id, followId: followed1._id });
      await request(app).put('/api/users/follow').send({ userId: testUser._id, followId: followed2._id });
      await request(app).put('/api/users/follow').send({ userId: testUser._id, followId: followed3._id });
      const res = await request(app).get(`/api/users/following/${testUser._id}`);
     
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });

  });

});


