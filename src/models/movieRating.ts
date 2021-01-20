import mongoose from "mongoose";

export interface MovieRating extends mongoose.Document {
  _id: string;
  movieId: string;
  userId: string;
  rating: number;
}

const MovieRatingSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    userId: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    versionKey: false,
  },
);

export const MovieRatingModel = mongoose.model<MovieRating>(
  "MovieRating",
  MovieRatingSchema,
  "MovieRatings",
);
