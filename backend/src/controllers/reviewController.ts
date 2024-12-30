import { Request, Response } from 'express';
import { getMovieByTMDid, createMovie } from './movieController';
import { Review } from '../models/reviewModel';
import { User } from '../models/userModel';
import mongoose from 'mongoose';
import { getMovieDetails } from './tmdbController';
import { ActivityType } from '../types/activityType';
import { logActivity } from './activityController';
import { log } from 'console';

// create review
export const createReview = async (
  title: string,
  body: string,
  rating: number,
  userId: mongoose.Types.ObjectId,
  movieId: mongoose.Types.ObjectId,
) => {
  const review = new Review({
    title,
    body,
    rating,
    user: userId,
    movie: movieId,
  });
  await review.save();
  await User.findByIdAndUpdate(userId, { $push: { reviews: review._id } });
  return review;
};

// get all reviews from a user
export const getReviewsByUserId = async (userId: string) => {
  // Ensure userId is properly converted to ObjectId
  const userObjectId = new mongoose.Types.ObjectId(userId);

  return await Review.find({ user: userObjectId });
};

// update review
export const updateReview = async (
  reviewId: mongoose.Types.ObjectId,
  updateData: Partial<{ title: string; body: string; rating: number }>,
) => {
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
  const { title, body, rating, userId, movieId } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    // Fetch the movie from the external API by movieId
    const movieData = await getMovieDetails(movieId);
    if (!movieData) {
      res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the user has already reviewed this movie
    const existingReview = await Review.findOne({
      user: user._id,
      'movie.TMDid': movieData.id,
    });

    if (existingReview) {
      // If review exists, update it
      const updatedReview = await updateReview(existingReview._id, {
        title,
        body,
        rating,
      });
      res.status(200).json(updatedReview); // Send the updated review
    } else {
      // If no existing review, create a new review
      const review = new Review({
        title,
        body,
        rating,
        user: user._id,
        movie: {
          title: movieData.title,
          releaseYear: movieData.release_date.split('-')[0],
          TMDid: movieData.id,
        },
      });

      // Save the review
      await review.save();

      await logActivity(userId.toString(), ActivityType.REVIEW, { review: review._id });

      res.status(201).json(review); // Return immediately after saving
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error adding review to movie', error: error.message });
  }
};

export const getUserReviews = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const reviews = await getReviewsByUserId(userId!.toString());
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching user reviews', error: error.message });
  }
};

export const updateReviewController = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const updateData = req.body;
  try {
    const review = await updateReview(
      new mongoose.Types.ObjectId(reviewId),
      updateData,
    );
    res.status(200).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating review', error: error.message });
  }
};

export const deleteReviewController = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  try {
    await deleteReview(new mongoose.Types.ObjectId(reviewId));
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting review', error: error.message });
  }
};
