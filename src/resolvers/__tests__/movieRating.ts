import * as setup from "../../__tests__/setup";
import { MovieModel, MovieRatingModel, UserModel } from "../../models";

import { saveMovieRating } from "../movieRating";

let testMongo: setup.TestMongoConn;

beforeEach(async () => {
  testMongo = await setup.beforeEach();
});

afterEach(() => setup.afterEach(testMongo));

describe("Test saveMovieRating", () => {
  it("should throw error if movie does not exist", async () => {
    const user = new UserModel({
      username: "johndoe",
      password: "test",
    });
    await user.save();

    const context = {
      userInfo: {
        id: user.id,
        username: user.username,
      },
    };

    let error;
    try {
      await saveMovieRating(
        undefined,
        {
          movieId: "notExistingId",
          rating: 5,
        },
        context,
      );
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new Error("Movie does not exist!"));
  });

  it("should throw error if no user is logged in", async () => {
    const movie = new MovieModel({
      name: "Prestige",
      release: Date.parse("2007-01-11"),
      duration: 130,
      actors: "Christian Bale, Hugh Jackman, Scarlett Johansson",
    });
    await movie.save();

    const context = {
      userInfo: null,
    };

    let error;
    try {
      await saveMovieRating(
        undefined,
        {
          movieId: movie.id,
          rating: 5,
        },
        context,
      );
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new Error("Not authenticated!"));
  });

  it("should create a new movieRating object for the currently logged in user and the selected movie", async () => {
    const movie = new MovieModel({
      name: "Prestige",
      release: Date.parse("2007-01-11"),
      duration: 130,
      actors: "Christian Bale, Hugh Jackman, Scarlett Johansson",
    });

    const user = new UserModel({
      username: "johndoe",
      password: "test",
    });

    await movie.save();
    await user.save();

    const context = {
      userInfo: {
        id: user.id,
        username: user.username,
      },
    };

    const response = await saveMovieRating(
      undefined,
      {
        movieId: movie.id,
        rating: 5,
      },
      context,
    );

    let movieRating = await MovieRatingModel.findOne({
      _id: response.movieRating.id,
    });

    expect(movieRating && movieRating.movieId).toEqual(movie.id);
    expect(movieRating && movieRating.userId).toEqual(user.id);
    expect(movieRating && movieRating.rating).toEqual(5);

    const movieRationCount = await MovieRatingModel.countDocuments();
    expect(movieRationCount).toBe(1);
  });

  it("should update the existing movieRating object if an id is provided", async () => {
    const movie = new MovieModel({
      name: "Prestige",
      release: Date.parse("2007-01-11"),
      duration: 130,
      actors: "Christian Bale, Hugh Jackman, Scarlett Johansson",
    });

    const user = new UserModel({
      username: "johndoe",
      password: "test",
    });

    await movie.save();
    await user.save();

    const context = {
      userInfo: {
        id: user.id,
        username: user.username,
      },
    };

    const movieRatingResponse = await saveMovieRating(
      undefined,
      {
        movieId: movie.id,
        rating: 5,
      },
      context,
    );

    const movieRating = movieRatingResponse.movieRating;

    const updatedMovieRatingResponse = await saveMovieRating(
      undefined,
      {
        _id: movieRating.id,
        movieId: movie.id,
        rating: 1,
      },
      context,
    );

    const updatedMovieRating = updatedMovieRatingResponse.movieRating;

    expect(updatedMovieRating && updatedMovieRating.movieId).toEqual(movie.id);
    expect(updatedMovieRating && updatedMovieRating.userId).toEqual(user.id);
    expect(updatedMovieRating && updatedMovieRating.rating).toEqual(1);

    const movieRationCount = await MovieRatingModel.countDocuments();
    expect(movieRationCount).toBe(1);
  });
});
