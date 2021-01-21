import { currentUser, register, login } from "./auth";
import { movies, addMovie, updateMovie, deleteMovie } from "./movie";
import { saveMovieRating, movieRating } from "./movieRating";
import { MOVIE_CHANGED, PUB_SUB } from "../constants";

const resolverMap = {
  Query: {
    currentUser,
    movies,
    movieRating,
  },
  Mutation: {
    login,
    register,
    addMovie,
    updateMovie,
    deleteMovie,
    saveMovieRating,
  },
  Subscription: {
    movieChanged: {
      subscribe: () => PUB_SUB.asyncIterator([MOVIE_CHANGED]),
    },
  },
};

export default resolverMap;
