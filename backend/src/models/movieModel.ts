// server/src/models/movieModel.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Movie {
  name: string;
};

// Define the movie schema
const movieSchema = new Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
});

// Define the Movie model based on the schema
const Movie = mongoose.model<Movie>('Movie', movieSchema);

export default Movie;
