import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {app} from '../../src/app'; 
import { User } from '../../src/models/userModel';
import bcrypt from 'bcrypt';
import { describe, it, beforeAll, afterAll, afterEach, expect } from '@jest/globals';
import e from 'express';

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

    it('should not allow to follow the same user twice', async () => {
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
      };
      await request(app).put('/api/users/follow').send(followPayload);
      const res = await request(app).put('/api/users/follow').send(followPayload);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already followed');
    });

    it('should not allow to follow yourself', async () => {
      const testUser = new User({
        name: 'Test User',
        username: 'testUser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await testUser.save();
      const followPayload = {
        userId: testUser._id,
        followId: testUser._id,
      };
      const res = await request(app).put('/api/users/follow').send(followPayload);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Cannot follow yourself');
    });

    it('should return error if user not found', async () => {
      const followUser = new User({
        name: 'Follow User',
        username: 'followUser',
        password: 'password',
        email: 'followuser@example.com',
      });
      await followUser.save();
      const followPayload = {
        userId: new mongoose.Types.ObjectId(),
        followId: followUser._id,
      };
      const res = await request(app).put('/api/users/follow').send(followPayload);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return error if user to follow not found', async () => {
      const testUser = new User({
        name: 'Test User',
        username: 'testUser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await testUser.save();
      const followPayload = {
        userId: testUser._id,
        followId: new mongoose.Types.ObjectId(),
      };
      const res = await request(app).put('/api/users/follow').send(followPayload);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User to follow not found');
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

    it('should return error if user not found', async () => {
      const followUser = new User({
        name: 'Follow User',
        username: 'followUser',
        password: 'password',
        email: 'followuser@example.com',
      });
      await followUser.save();
      const unfollowPayload = {
        userId: new mongoose.Types.ObjectId(),
        unfollowId: followUser._id,
      };
      const res = await request(app).put('/api/users/unfollow').send(unfollowPayload);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return error if user to unfollow not found', async () => {
      const testUser = new User({
        name: 'Test User',
        username: 'testUser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await testUser.save();
      const unfollowPayload = {
        userId: testUser._id,
        unfollowId: new mongoose.Types.ObjectId(),
      };
      const res = await request(app).put('/api/users/unfollow').send(unfollowPayload);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User to unfollow not found');
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

    it('should return error if user not found', async () => {
      const res = await request(app).get(`/api/users/followers/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return an error if userId format is invalid', async () => {
      const res = await request(app).get('/api/users/followers/123');
      expect(res.status).toBe(500);
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

    it('should return error if user not found', async () => {
      const res = await request(app).get(`/api/users/following/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return an error if userId format is invalid', async () => {
      const res = await request(app).get('/api/users/following/123');
      expect(res.status).toBe(500);
    });

  });

  describe('GET /info', () => {

    it('should return user info without password and email', async () => {
      const user1 = new User({
        name: 'User 1',
        username: 'user1',
        password: 'password',
        email: 'user1@example.com',
      });
      await user1.save();
      const user2 = new User({
        name: 'User 2',
        username: 'user2',
        password: 'password',
        email: 'user2@example.com',
      });
      await user2.save();
      const testUser = new User({
        name: 'Test User',
        username: 'testUser',
        password: 'password',
        email: 'testuser@example.com',
        following: [user1._id],
        followers: [user2._id],
        profilePicture: '/default-profile.png',
      });
      await testUser.save();
      const res = await request(app).get(`/api/users/info/${testUser._id}`);
      expect(res.status).toBe(200);
      expect(res.body.password).toBeUndefined();
      expect(res.body.email).toBeUndefined();
      expect(res.body.following.length).toBe(1);
      expect(res.body.followers.length).toBe(1);
      expect(res.body.following[0].username).toBe(user1.username);
      expect(res.body.followers[0].username).toBe(user2.username);
      expect(res.body.profilePicture).toBe('/default-profile.png');
    });

    it('should return error if user not found', async () => {
      const res = await request(app).get(`/api/users/info/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return an error if userId format is invalid', async () => {
      const res = await request(app).get('/api/users/info/123');
      expect(res.status).toBe(500);
    });

  });

  describe('GET /user', () => {

    it('should return user by username', async () => {
      const user = new User({
        name: 'Test User',
        username: 'testuser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await user.save();
      const res = await request(app).get(`/api/users/user/${user.username}`);
      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe(user.username);
    });

    it('should return error if user not found', async () => {
      const res = await request(app).get('/api/users/user/nonexistentuser');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

  });

  describe('PUT /profile-picture', () => {

    it('should update user profile picture', async () => {
      const user = new User({
        name: 'Test User',
        username: 'testuser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await user.save();
      const profilePicture = '/new-profile.png';
      const res = await request(app).put('/api/users/profile-picture').send({ userId: user._id, profilePicture });
      expect(res.status).toBe(200);
      expect(res.body.profilePicture).toBe(profilePicture);
      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.profilePicture).toBe(profilePicture);
    });

    it('should return error if user not found', async () => {
      const profilePicture = '/new-profile.png';
      const res = await request(app).put('/api/users/profile-picture').send({ userId: new mongoose.Types.ObjectId(), profilePicture });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return an error if userId format is invalid', async () => {
      const profilePicture = '/new-profile.png';
      const res = await request(app).put('/api/users/profile-picture').send({ userId: '123', profilePicture });
      expect(res.status).toBe(500);
    });

  });

  describe('GET /', () => {

    it('should return all users', async () => {
      const user1 = new User({
        name: 'User 1',
        username: 'user1',
        password: 'password',
        email: 'user1@example.com',
      });
      await user1.save();
      const user2 = new User({
        name: 'User 2',
        username: 'user2',
        password: 'password',
        email: 'user2@example.com',
      });
      await user2.save();
      const user3 = new User({
        name: 'User 3',
        username: 'user3',
        password: 'password',
        email: 'user3@example.com',
      });
      await user3.save();
      const res = await request(app).get('/api/users/');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0].username).toBe(user1.username);
      expect(res.body[1].username).toBe(user2.username);
      expect(res.body[2].username).toBe(user3.username);
    });

    it('should return empty array if there are no users', async () => {
      const res = await request(app).get('/api/users/');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });

  });

  describe('GET /:id', ()=> {

    it('should return user by id', async () => {
      const user = new User({
        name: 'Test User',
        username: 'testuser',
        password: 'password',
        email: 'testuser@example.com',
      });
      await user.save();
      const res = await request(app).get(`/api/users/${user._id}`);
      expect(res.status).toBe(200);
      expect(res.body.username).toBe(user.username);
    });

    it('should return error if user not found', async () => {
      const res = await request(app).get(`/api/users/${new mongoose.Types.ObjectId()}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return an error if userId format is invalid', async () => {
      const res = await request(app).get('/api/users/123');
      expect(res.status).toBe(500);
    });

  });

});


