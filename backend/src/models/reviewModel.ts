import mongoose from 'mongoose';

// Modified review schema with embedded movie fields
const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: {
    title: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    TMDid: { type: String, required: true }
  }
},
{
  timestamps: true,
});

export const Review = mongoose.model('Review', reviewSchema);