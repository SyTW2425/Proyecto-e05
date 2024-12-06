import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
}, {
  timestamps: true,
});

export const List = mongoose.model('List', listSchema);