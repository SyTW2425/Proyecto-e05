import { Movie } from '../models/movieModel';

// create new movie
export const createMovie = async (title: string, releaseYear: number, TMDid: number) => {
  const movie = new Movie({ title, releaseYear, TMDid });
  await movie.save();
  return movie;
}

// get movie by TMDid
export const getMovieByTMDid = async (TMDid: number) => {
  return await Movie.findOne({ TMDid });
}

// update movie
export const updateMovie = async (TMDid: number, updateData: Partial<{ title: string; releaseYear: number }>) => {
  return await Movie.findOneAndUpdate({ TMDid }, updateData, { new: true });
};

// delete movie
export const deleteMovie = async (TMDid: number) => {
  return await Movie.findOneAndDelete({ TMDid });
};