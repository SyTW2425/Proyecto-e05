import express, { Request, Response } from 'express';
import { Review } from '../models/reviewModel';

export const reviewRouter = express.Router();

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Retrieve all reviews
 *     description: Fetches all reviews from the database.
 *     responses:
 *       200:
 *         description: A list of reviews.
 *       500:
 *         description: Server error
 */
reviewRouter.get('/', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().populate('user movie');
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     description: Adds a new review to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - rating
 *               - user
 *               - movie
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the review
 *               body:
 *                 type: string
 *                 description: The review content
 *               rating:
 *                 type: number
 *                 description: Rating out of 10
 *               user:
 *                 type: string
 *                 description: ID of the user who wrote the review
 *               movie:
 *                 type: string
 *                 description: ID of the movie being reviewed
 *     responses:
 *       201:
 *         description: Review created successfully
 *       500:
 *         description: Server error
 */
reviewRouter.post('/', async (req: Request, res: Response) => {
  const { title, body, rating, user, movie } = req.body;

  try {
    const newReview = new Review({ title, body, rating, user, movie });
    await newReview.save();
    res.status(201).json({
      message: 'Review created successfully',
      review: newReview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

export default reviewRouter;