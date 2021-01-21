import { MOVIE_CHANGED, PUB_SUB } from "../constants";
import { Movie, MovieModel, MovieRatingModel } from "../models";

export async function movies(_: void, _args: any): Promise<Array<Movie>> {
  if (_args.selectedSortField && _args.direction)
    return MovieModel.find().sort({
      [_args.selectedSortField]: _args.direction,
    });
  else return MovieModel.find();
}

export async function addMovie(_: void, _args: any): Promise<Movie | null> {
  const { name, release, duration, actors } = _args;

  const existingMovie: number = await MovieModel.countDocuments({ name });
  if (existingMovie) {
    throw new Error("Movie already exists!");
  }

  const newMovie: Movie = new MovieModel({
    name,
    release,
    duration,
    actors,
  });

  PUB_SUB.publish(MOVIE_CHANGED, {
    movieChanged: "The movie '" + name + "' was added!",
  });

  return newMovie.save();
}

export async function updateMovie(_: void, _args: any): Promise<Movie | null> {
  const { _id, name, release, duration, actors } = _args;

  let movie = null;

  movie = await MovieModel.findOne({ _id });

  if (!movie) {
    throw new Error("Movie does not exist!");
  }

  const existingMovie: number = await MovieModel.countDocuments({
    name: name,
    _id: { $ne: _id },
  });
  if (existingMovie) {
    throw new Error("Movie already exists!");
  }

  movie = await MovieModel.findByIdAndUpdate(
    { _id: _id },
    {
      name,
      release,
      duration,
      actors,
    },
    { new: true },
    (error) => {
      if (error) throw new Error("An Error occurred while updating a movie!");
    },
  );

  PUB_SUB.publish(MOVIE_CHANGED, {
    movieChanged: "The movie '" + movie?.name + "' was updated!",
  });

  return movie;
}

export async function deleteMovie(_: void, _args: any): Promise<Boolean> {
  const { _id } = _args;

  if ((await MovieModel.deleteOne({ _id: _id })).deletedCount) {
    PUB_SUB.publish(MOVIE_CHANGED, {
      movieChanged: "Movie Deleted!",
    });

    return true;
  } else throw new Error("An Error occurred while deleting a movie!");
}

export async function updateAverageRating(movieId: string): Promise<Movie> {
  //Calculate the average_rating for the current movie
  const aggregatedRatings = await MovieRatingModel.aggregate([
    {
      $match: {
        movieId: {
          $eq: movieId,
        },
      },
    },
    {
      $group: {
        _id: { _id: null },
        ratings_sum: { $sum: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const average_rating = (
    aggregatedRatings[0]["ratings_sum"] / aggregatedRatings[0]["count"]
  ).toFixed(2);

  //Update the average_rating for the current movie
  const movie = await MovieModel.findOneAndUpdate(
    { _id: movieId },
    { average_rating },
    { new: true },
  );

  if (!movie) {
    throw new Error("Average rating could not be updated!");
  }

  return movie;
}
