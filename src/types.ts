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
  userInfo: UserInfo | null;
}

export interface SaveMovieRatingResponse {
  movieRating: MovieRating;
  movie: Movie;
}
