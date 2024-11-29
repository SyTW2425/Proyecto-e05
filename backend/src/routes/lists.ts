import express, { Request, Response, Router } from 'express';
import { List } from '../models/listModel';
import { addMovieToList } from '../controllers/listController';

const listRouter = express.Router();

listRouter.post('/add-movie', addMovieToList);

export default listRouter;

/*

Old code:

listRouter.get('/', async (req: Request, res: Response) => {
  try {
    const lists = await List.find().populate('user movies');
    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch lists' });
  }
});


listRouter.post('/', async (req: Request, res: Response) => {
  const { name, description, user, movies } = req.body;

  try {
    const newList = new List({ name, description, user, movies });
    await newList.save();
    res.status(201).json({
      message: 'List created successfully',
      list: newList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create list' });
  }
});
*/