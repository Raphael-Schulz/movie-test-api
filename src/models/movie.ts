import mongoose from "mongoose";

export interface Movie extends mongoose.Document {
  _id: string;
  name: string;
  release: Date;
  duration: number;
  actors: string;
  average_rating: string;
}

const MovieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    release: { type: Date, required: false },
    duration: { type: Number, required: false },
    actors: { type: String, required: false },
    average_rating: { type: String, required: false },
  },
  {
    versionKey: false,
  },
);

export const MovieModel = mongoose.model<Movie>("Movie", MovieSchema, "Movies");
