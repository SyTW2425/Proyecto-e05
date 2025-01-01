import express from 'express';
import { addReviewToMovie, getUserReviews, updateReviewController, deleteReviewController } from '../controllers/reviewController';

export const reviewRouter = express.Router();

reviewRouter.post('/add-review', addReviewToMovie);
reviewRouter.get('/user/reviews', getUserReviews);
reviewRouter.put('/review/:reviewId', updateReviewController);
reviewRouter.delete('/review/:reviewId', deleteReviewController);

export default reviewRouter;

