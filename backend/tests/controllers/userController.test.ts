import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {app} from '../../src/app'; 
import { User } from '../../src/models/userModel';
import bcrypt from 'bcrypt';
import { describe, it, beforeAll, afterAll, afterEach, expect } from '@jest/globals';

describe('Auth Controller Tests', () => {
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
});
