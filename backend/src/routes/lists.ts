import express, { Request, Response, Router } from 'express';
import { List } from '../models/listModel';
import { createListController,
  getUserListsController,
  deleteListController,
  addMovieToListController,
  removeMovieFromListController } from '../controllers/listController';

const listRouter = express.Router();

listRouter.post('/create-list', createListController);
listRouter.get('/user-lists/:userId', getUserListsController);
listRouter.delete('/delete-list/:listId', deleteListController);
listRouter.post('/add-movie-to-list', addMovieToListController);
listRouter.delete('/remove-movie-from-list', removeMovieFromListController);

export default listRouter;
