import express, { Request, Response } from 'express';
import {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getNowPlayingMovies,
  getGenres,
  getMovieTrailers,
  getMovieCredits,
  getMovieImages,
  getMovieReviews,
  getSimilarMovies,
  getMovieVideos,
  getMoviesByGenres,
} from '../controllers/tmdbController';

const tmdbRouter = express.Router();

tmdbRouter.get('/search', async (req, res) => {
  const { query, page } = req.query;
  try {
    const data = await searchMovies(
      query as string,
      parseInt(page as string, 10),
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

tmdbRouter.get('/movie/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getMovieDetails(parseInt(id, 10));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get movie details' });
  }
});

tmdbRouter.get('/search-popular', async (req, res) => {
  const { page, year } = req.query;
  try {
    const data = await getPopularMovies(parseInt(page as string, 10) || 1, parseInt(year as string, 10));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest movies' });
  }
});

tmdbRouter.get('/now-playing', async (req: Request, res: Response) => {
  const { page } = req.query;
  try {
    const data = await getNowPlayingMovies(parseInt(page as string, 10) || 1);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch now playing movies' });
  }
});

tmdbRouter.get('/genres', async (req, res) => {
  try {
    const data = await getGenres();
    res.status(200).json({ genres: data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

tmdbRouter.get('/genres/:id', async (req, res) => {
  const { id } = req.params;
  const { page } = req.query;
  const { year } = req.query;
  try {
    const data = await getMoviesByGenres([parseInt(id, 10)], parseInt(page as string, 10) || 1, parseInt(year as string, 10));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies by genre' });
  }
});

tmdbRouter.get('/movie/:id/trailers', async (req, res) => {
  const { id } = req.params;
  try {
    const trailers = await getMovieTrailers(parseInt(id, 10));
    res.status(200).json(trailers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie trailers' });
  }
});

tmdbRouter.get('/movie/:id/credits', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getMovieCredits(parseInt(id, 10));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie credits' });
  }
});

tmdbRouter.get('/movie/:id/images', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getMovieImages(parseInt(id, 10));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie images' });
  }
});

tmdbRouter.get('/movie/:id/reviews', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getMovieReviews(parseInt(id, 10));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie reviews' });
  }
});

tmdbRouter.get('/movie/:id/similar', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getSimilarMovies(parseInt(id, 10));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar movies' });
  }
});

tmdbRouter.get('/movie/:id/videos', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getMovieVideos(parseInt(id, 10));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie videos' });
  }
});

tmdbRouter.get('/movies-by-genres', async (req, res) => {
  const { genres, page, year } = req.query;
  try {
    const genreIds = genres
      ? (genres as string).split(',').map((id) => parseInt(id.trim(), 10))
      : [];

    const data = await getMoviesByGenres(genreIds, parseInt(page as string, 10) || 1, parseInt(year as string, 10));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies by genres' });
  }
});


export default tmdbRouter;
