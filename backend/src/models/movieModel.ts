import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  TMDid: { type: Number, required: true, unique: true }, //id in the external api
  // we could add more fields or use the external api
});

export const Movie = mongoose.model('Movie', movieSchema);