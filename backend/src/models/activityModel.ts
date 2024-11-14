import mongoose from 'mongoose';
import { ActivityType } from '../types/activityType';

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ActivityType, required: true },
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  createdAt: { type: Date, default: Date.now },
});

export const Activity = mongoose.model('Activity', activitySchema);
