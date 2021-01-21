import { Context, SaveMovieRatingResponse } from "../types";
import { MovieModel, MovieRating, MovieRatingModel } from "../models";
import { checkAuthentication } from "./auth";
import { MOVIE_CHANGED, PUB_SUB } from "../constants";
import { updateAverageRating } from "./movie";

export async function saveMovieRating(
  _: void,
  _args: any,
  ctx: Context,
): Promise<SaveMovieRatingResponse> {
  await checkAuthentication(ctx);
  const { _id, movieId, rating } = _args;
  const userId = ctx.userInfo && ctx.userInfo.id;

  let movieRating = null;
  let movie = null;

  try {
    movie = await MovieModel.findById(movieId);
  } catch {
    throw new Error("Movie does not exist!");
  }

  //If an ID is provided update the existing element if not create a new one
  if (_id) {
    movieRating = await MovieRatingModel.findByIdAndUpdate(
      { _id },
      { rating },
      { new: true },
    );
  } else {
    movieRating = new MovieRatingModel({ movieId, userId, rating });
    await movieRating.save();
  }

  if (!movieRating) {
    throw new Error("MovieRating could not be created!");
  }

  movie = await updateAverageRating(movieId);

  const notificationText = _id
    ? "A rating for the move '" + movie?.name + "' was updated!"
    : "A new rating for the movie '" + movie?.name + "' was added!";

  PUB_SUB.publish(MOVIE_CHANGED, {
    movieChanged: notificationText,
  });

  return {
    movie: movie,
    movieRating: movieRating,
  };
}

export async function movieRating(
  _: void,
  _args: any,
  ctx: Context,
): Promise<MovieRating | null> {
  await checkAuthentication(ctx);

  if (ctx.userInfo) {
    const movieRating = await MovieRatingModel.findOne({
      movieId: _args.movieId,
      userId: ctx.userInfo.id,
    });

    return movieRating;
  }

  return null;
}
