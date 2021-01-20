import { currentUser, register, login, logout } from "./auth";
import { movies, addMovie, updateMovie, deleteMovie } from "./movie";
import { saveMovieRating, movieRating } from "./movieRating";

const resolverMap = {
  Query: {
    currentUser,
    movies,
    movieRating,
  },
  Mutation: {
    login,
    logout,
    register,
    addMovie,
    updateMovie,
    deleteMovie,
    saveMovieRating,
  },
};

export default resolverMap;
