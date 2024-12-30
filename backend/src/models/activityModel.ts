import mongoose from 'mongoose';
import { ActivityType } from '../types/activityType';

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ActivityType, required: true },
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  followed: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, index: { expires: 0 } },
});

export const Activity = mongoose.model('Activity', activitySchema);
