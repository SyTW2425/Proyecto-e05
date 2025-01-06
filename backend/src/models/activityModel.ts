import mongoose from 'mongoose';
import { ActivityType } from '../types/activityType';

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ActivityType, required: true },
  review: { 
    type: {
      title: { type: String, required: true },
      body: { type: String, required: true },
      rating: { type: Number, required: true, min: 0, max: 10 },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      movie: {
        title: { type: String, required: true },
        releaseYear: { type: Number, required: true },
        TMDid: { type: String, required: true },
      },
    },
    required: false },
  list: { 
    type: {
      name: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    },
    required: false },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  followed: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, index: { expires: 0 } },
});

export const Activity = mongoose.model('Activity', activitySchema);
