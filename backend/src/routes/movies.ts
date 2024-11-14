import express, { Request, Response } from 'express';
import { Movie } from '../models/movieModel';

export const movieRouter = express.Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Retrieve a list of all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   releaseYear:
 *                     type: integer
 *                   TMDid:
 *                     type: integer
 *       500:
 *         description: Failed to fetch movies.
 */
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

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the movie.
 *                 example: Inception
 *               releaseYear:
 *                 type: integer
 *                 description: The release year of the movie.
 *                 example: 2010
 *               TMDid:
 *                 type: integer
 *                 description: The ID of the movie in the external API.
 *                 example: 12345
 *     responses:
 *       201:
 *         description: Movie created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movie created successfully
 *                 movie:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     releaseYear:
 *                       type: integer
 *                     TMDid:
 *                       type: integer
 *       500:
 *         description: Failed to create movie.
 */
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
