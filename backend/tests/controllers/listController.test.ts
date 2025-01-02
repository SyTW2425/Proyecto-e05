import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../src/app';
import { List } from '../../src/models/listModel';
import { User } from '../../src/models/userModel';
import { describe, it, beforeAll, afterAll, afterEach, expect } from '@jest/globals';
import { Movie } from '../../src/models/movieModel';

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

    it('should not create a list if it already exists for the user', async () => {
      const list = new List({
        name: 'Test List',
        user: user._id,
      });
      await list.save();
      const listPayload = {
        name: 'Test List',
        userId: user._id.toString(),
      };
      const res = await request(app).post('/api/lists/create').send(listPayload);
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('List already exists for user');
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

  describe('DELETE /delete/:listId', () => {
    
    it('should delete a list successfully', async () => {
      const list = new List({
        name: 'Test List',
        user: user._id,
      });
      await list.save();
      const res = await request(app).delete('/api/lists/delete/' + list._id);
      expect(res.status).toBe(200);
      const deletedList = await List.findOne({ _id: list._id });
      expect(deletedList).toBeFalsy();
    });

    it('should return an error if the listId is invalid', async () => {
      const res = await request(app).delete('/api/lists/delete/123');
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid listId format');
    });

  });

  describe('POST /add-movie', () => {

    it('should add a movie to a list successfully', async () => {
      const list = new List({
        name: 'Test List',
        user: user._id,
      });
      await list.save();
      const listPayload = {
        listId: list._id,
        title: 'Titanic',
        releaseYear: 1997,
        TMDid: 597,
      };
      const res = await request(app).post('/api/lists/add-movie').send(listPayload);
      expect(res.status).toBe(200);
      const updatedList = await List.findOne({ _id: list._id }).populate('movies');
      expect(updatedList?.movies.length).toBe(1);
    });

    it('should return an error if the listId is invalid', async () => {
      const listPayload = {
        listId: '123',
        title: 'Titanic',
        releaseYear: 1997,
        TMDid: 597,
      };
      const res = await request(app).post('/api/lists/add-movie').send(listPayload);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid listId format');
    });

    it('should return an error if the list does not exist', async () => {
      const listPayload = {
        listId: new mongoose.Types.ObjectId(),
        title: 'Titanic',
        releaseYear: 1997,
        TMDid: 597,
      };
      const res = await request(app).post('/api/lists/add-movie').send(listPayload);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('List not found');
    });

  });

  describe('DELETE /remove-movie', () => {

    it('should remove a movie from a list successfully', async () => {
      const list = new List({
        name: 'Test List',
        user: user._id,
      });
      await list.save();
      const listPayload = {
        listId: list._id,
        title: 'Titanic',
        releaseYear: 1997,
        TMDid: 597,
      };
      const res1 = await request(app).post('/api/lists/add-movie').send(listPayload);
      expect(res1.status).toBe(200);
      const movie = await Movie.findOne({ TMDid: 597 });
      const res = await request(app).delete('/api/lists/remove-movie').send({ listId: list._id, movieId: movie?._id });
      expect(res.status).toBe(200);
      const updatedList = await List.findOne({ _id: list._id }).populate('movies');
      expect(updatedList?.movies.length).toBe(0);
    });

    it('should return an error if the listId is invalid', async () => {
      const listPayload = {
        listId: '123',
        movieId: '123',
      };
      const res = await request(app).delete('/api/lists/remove-movie').send(listPayload);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid listId format');
    });

    it('should return an error if the list does not exist', async () => {
      const listPayload = {
        listId: new mongoose.Types.ObjectId(),
        movieId: new mongoose.Types.ObjectId(),
      };
      const res = await request(app).delete('/api/lists/remove-movie').send(listPayload);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('List not found');
    });

    it('should return an error if the movieId is invalid', async () => {
      const list = new List({
        name: 'Test List',
        user: user._id,
      });
      await list.save();
      const listPayload = {
        listId: list._id,
        title: 'Titanic',
        releaseYear: 1997,
        TMDid: 597,
      };
      await request(app).post('/api/lists/add-movie').send(listPayload);
      const res = await request(app).delete('/api/lists/remove-movie').send({ listId: list._id, movieId: '123' });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid movieId format');
    });

  });

});