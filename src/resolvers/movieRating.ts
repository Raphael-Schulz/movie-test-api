import { Context, SaveMovieRatingResponse } from "../types";
import { MovieModel, MovieRating, MovieRatingModel } from "../models";
import { checkAuthentication } from "./auth";

export async function saveMovieRating(
  _: void,
  _args: any,
  ctx: Context,
): Promise<SaveMovieRatingResponse> {
  await checkAuthentication(ctx);
  const { _id, movieId, rating } = _args;
  const userId = ctx.userInfo.id;

  let movieRating = null;

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

  //Calculate the new average_rating for the current movie
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

  const movieRating = await MovieRatingModel.findOne({
    movieId: _args.movieId,
    userId: ctx.userInfo.id,
  });

  return movieRating;
}
