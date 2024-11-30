import express, { Request, Response } from 'express';
import {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getNowPlayingMovies,
  getGenres,
  getMovieTrailers,
  getMovieCredits,
} from '../controllers/tmdbController';

const tmdbRouter = express.Router();

/**
 * @swagger
 * /tmdb/search:
 *   get:
 *     summary: Search for movies by title
 *     tags: [TMDb]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query.
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
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   release_date:
 *                     type: string
 *                   poster_path:
 *                     type: string
 *                   overview:
 *                     type: string
 *                   vote_average:
 *                     type: number
 *       500:
 *         description: Failed to fetch movies.
 */
tmdbRouter.get('/search', async (req, res) => {
  const { query, page } = req.query;
  try {
    const data = await searchMovies(
      query as string,
      parseInt(page as string, 10),
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

/**
 * @swagger
 * /tmdb/movie/{id}:
 *   get:
 *     summary: Get movie details by TMDb ID
 *     tags: [TMDb]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The TMDb ID of the movie.
 *     responses:
 *       200:
 *         description: A movie object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 release_date:
 *                   type: string
 *                 poster_path:
 *                   type: string
 *                 overview:
 *                   type: string
 *                 vote_average:
 *                   type: number
 *       500:
 *         description: Failed to fetch movie details.
 */
tmdbRouter.get('/movie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getMovieDetails(parseInt(id, 10));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get movie details' });
  }
});

tmdbRouter.get('/search-popular', async (req, res) => {
  const { page } = req.query;
  try {
    const data = await getPopularMovies(parseInt(page as string, 10) || 1);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest movies' });
  }
});

tmdbRouter.get('/now-playing', async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    const data = await getNowPlayingMovies(parseInt(page as string, 10) || 1);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch now playing movies' });
  }
});

// Get all genres
tmdbRouter.get('/genres', async (req, res) => {
  try {
    const data = await getGenres();
    res.json({ genres: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

tmdbRouter.get('/movie/:id/trailers', async (req, res) => {
  const { id } = req.params;
  try {
    const trailers = await getMovieTrailers(parseInt(id, 10));
    res.json(trailers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie trailers' });
  }
});


tmdbRouter.get('/movie/:id/credits', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getMovieCredits(parseInt(id, 10));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie credits' });
  }
});


export default tmdbRouter;
