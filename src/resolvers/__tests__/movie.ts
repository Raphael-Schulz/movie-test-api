import { MovieModel } from "../../models";
import * as setup from "../../__tests__/setup";
import { updateMovie } from "../movie";

let testMongo: setup.TestMongoConn;

beforeEach(async () => {
  testMongo = await setup.beforeEach();
});

afterEach(() => setup.afterEach(testMongo));

describe("Test updateMovie", () => {
  it("should throw error if movie does not exist", async () => {
    var notExistingId = require("mongoose").Types.ObjectId();
    let error;
    try {
      await updateMovie(undefined, {
        _id: notExistingId,
        name: "test",
      });
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new Error("Movie does not exist!"));
  });

  it("should throw error if the new name already exists in another movie", async () => {
    const first_movie = new MovieModel({
      name: "Prestige",
    });

    const second_movie = new MovieModel({
      name: "Oceans 11",
    });

    await first_movie.save();
    await second_movie.save();

    let error;
    try {
      await updateMovie(undefined, {
        _id: first_movie.id,
        name: "Oceans 11",
      });
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(new Error("Movie already exists!"));
  });

  it("should update all fields that are submitted for the current movie", async () => {
    const movie = new MovieModel({
      name: "Oceans 11",
    });

    await movie.save();

    const updatedMovie = await updateMovie(undefined, {
      _id: movie.id,
      name: "Prestige",
      release: new Date("2007-01-11"),
      duration: 130,
      actors: "Christian Bale, Hugh Jackman, Scarlett Johansson",
    });

    expect(updatedMovie && updatedMovie.name).toEqual("Prestige");
    expect(updatedMovie && updatedMovie.release).toEqual(
      new Date("2007-01-11"),
    );
    expect(updatedMovie && updatedMovie.duration).toEqual(130);
    expect(updatedMovie && updatedMovie.actors).toEqual(
      "Christian Bale, Hugh Jackman, Scarlett Johansson",
    );

    const movieRationCount = await MovieModel.countDocuments();
    expect(movieRationCount).toBe(1);
  });
});
