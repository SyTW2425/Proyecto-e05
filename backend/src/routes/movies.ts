/*
import express, { Request, Response } from 'express';
import { Movie } from '../models/movieModel';

export const movieRouter = express.Router();


// Route to get all movies
movieRouter.get('/', async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
});

// Route to create a new movie
movieRouter.post('/', async (req: Request, res: Response) => {
  const { title, releaseYear, TMDid } = req.body;

  try {
    const newMovie = new Movie({
      title,
      releaseYear,
      TMDid,
    });

    await newMovie.save();
    res.status(201).json({
      message: 'Movie created successfully',
      movie: newMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create movie' });
  }
});

export default movieRouter;
*/