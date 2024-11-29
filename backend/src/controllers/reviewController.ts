import { Request, Response } from 'express';
import { getMovieByTMDid, createMovie } from './movieController';
import { Review } from '../models/reviewModel';
import { User } from '../models/userModel';
import mongoose from 'mongoose';

// create review
export const createReview = async (title: string, body: string, rating: number, userId: mongoose.Types.ObjectId, movieId: mongoose.Types.ObjectId) => {
  const review = new Review({ title, body, rating, user: userId, movie: movieId });
  await review.save();
  await User.findByIdAndUpdate(userId, { $push: { reviews: review._id } });
  return review;
};

// get all reviews from a user
export const getReviewsByUserId = async (userId: mongoose.Types.ObjectId) => {
  return await Review.find({ user: userId }).populate('movie');
};

// update review
export const updateReview = async (reviewId: mongoose.Types.ObjectId, updateData: Partial<{ title: string; body: string; rating: number }>) => {
  return await Review.findByIdAndUpdate(reviewId, updateData, { new: true });
};

// delete review
export const deleteReview = async (reviewId: mongoose.Types.ObjectId) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (review) {
    await User.findByIdAndUpdate(review.user, { $pull: { reviews: reviewId } });
  }
  return review;
};


export const addReviewToMovie = async (req: Request, res: Response) => {
  const { movieTitle, releaseYear, TMDid, reviewTitle, body, rating, userId } = req.body;
  try {
    let movie = await getMovieByTMDid(TMDid);
    if (!movie) {
      movie = await createMovie(movieTitle, releaseYear, TMDid);
    }
    const review = await createReview(reviewTitle, body, rating, new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(movie._id));
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review to movie', error: error.message });
  }
};


export const getUserReviews = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const reviews = await getReviewsByUserId(new mongoose.Types.ObjectId(userId));
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reviews', error: error.message });
  }
};


export const updateReviewController = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const updateData = req.body;
  try {
    const review = await updateReview(new mongoose.Types.ObjectId(reviewId), updateData);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};


export const deleteReviewController = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  try {
    await deleteReview(new mongoose.Types.ObjectId(reviewId));
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};