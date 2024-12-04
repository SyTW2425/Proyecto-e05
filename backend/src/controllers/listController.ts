import { Request, Response } from 'express';
import { createMovie, getMovieByTMDid } from '../controllers/movieController';
import { List } from '../models/listModel';


export const createListController = async (req: Request, res: Response): Promise<void> => {
  const { name, userId } = req.body;
  try {
    const list = new List({ name, user: userId });
    await list.save();
    res.status(201).json(list);
  } catch(error) {
    res.status(500).json({ message: 'Error creating list', error: error.message });
  }
}

// Get all lists for a user
export const getUserListsController = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query;
  try {
    const lists = await List.find({ user: userId }).populate('movies');
    res.status(200).json(lists);
  } catch(error) {
    res.status(500).json({ message: 'Error fetching user lists', error: error.message });
  }
}

/*
// This could be used if we decide to remove the populate from the getUserListsController.
// Get a list by ID.
export const getList = async (req: Request, res: Response): Promise<void> => {
  const { listId } = req.params;
  try {
    const list = await List.findById(listId).populate('movies');
    if (!list) {
      res.status(404).json({ message: 'List not found' });
    }
    res.status(200).json(list);
  } catch(error) {
    res.status(500).json({ message: 'Error fetching list', error: error.message });
  }
}
  */

// Delete a list
export const deleteListController = async (req: Request, res: Response): Promise<void> => {
  const { listId } = req.query;
  try {
    await List.findOneAndDelete({ _id: listId });
    res.status(200).json({ message: 'List deleted successfully' });
  } catch(error) {
    res.status(500).json({ message: 'Error deleting list', error: error.message });
  }
}


// Add a movie to a list
export const addMovieToListController = async (req: Request, res: Response): Promise<void> => {
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


// Remove a movie from a list
export const removeMovieFromListController = async (req: Request, res: Response): Promise<void> => {
  const { listId, movieId } = req.body;
  try {
    const list = await List.findById(listId);
    if (!list) {
      res.status(404).json({ message: 'List not found' });
    }
    list.movies = list.movies.filter((movie) => movie.toString() !== movieId);
    await list.save();
    const populatedList = await list.populate('movies');
    res.status(200).json(populatedList);
  } catch(error) {
    res.status(500).json({ message: 'Error removing movie from list', error: error.message });
  }
}

