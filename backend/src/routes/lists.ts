import express, { Request, Response, Router } from 'express';
import { List } from '../models/listModel';
import { createListController,
  getUserListsController,
  deleteListController,
  addMovieToListController,
  removeMovieFromListController } from '../controllers/listController';

const listRouter = express.Router();

listRouter.post('/create', createListController);
listRouter.get('/user-lists/:userId', getUserListsController);
listRouter.delete('/delete/:listId', deleteListController);
listRouter.post('/add-movie', addMovieToListController);
listRouter.delete('/remove-movie', removeMovieFromListController);

export default listRouter;
