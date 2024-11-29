import { Request, Response } from 'express';
import { createMovie, getMovieByTMDid } from '../controllers/movieController';
import { List } from '../models/listModel';


export const addMovieToList = async (req: Request, res: Response): Promise<void> => {
  const { listId, title, releaseYear, TMDid } = req.body;
  try {
    const list = await List.findOne({ _id: listId });
    if (!list) {
      res.status(404).json({ message: 'List not found' });
    }
    let movie = await getMovieByTMDid(TMDid);
    if (!movie) {
      movie = await createMovie(title, releaseYear, TMDid);
    }
    if (!list.movies.includes(movie._id)) {
      list.movies.push(movie._id);
      await list.save();
    }
    res.status(200).json(list);
  } catch(error) {
    res.status(500).json({ message: 'Error adding movie to list', error: error.message });
  }
};