import { Response } from "express";
import { Movie, MovieRating } from "./models";

export interface RegisterResponse extends UserInfo {}

export interface LoginResponse {
  token: string;
}

export interface UserInfo {
  id: string;
  username: string;
}

export interface Context {
  userInfo: UserInfo;
  res: Response;
}

export interface SaveMovieRatingResponse {
  movieRating: MovieRating | null;
  movie: Movie | null;
}
