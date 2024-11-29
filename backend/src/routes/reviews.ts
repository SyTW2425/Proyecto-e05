import express, { Request, Response } from 'express';
import { Review } from '../models/reviewModel';
import { addReviewToMovie, getUserReviews, updateReviewController, deleteReviewController } from '../controllers/reviewController';

export const reviewRouter = express.Router();

reviewRouter.post('/add-review', addReviewToMovie);
reviewRouter.get('/user/reviews', getUserReviews);
reviewRouter.put('/review/:reviewId', updateReviewController);
reviewRouter.delete('/review/:reviewId', deleteReviewController);

export default reviewRouter;



/*

old code:

reviewRouter.get('/', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().populate('user movie');
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

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
*/