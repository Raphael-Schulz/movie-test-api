import * as setup from "../../__tests__/setup";
import { UserModel } from "../../models";

import { movieRating } from "../movieRating";

let testMongo: setup.TestMongoConn;

beforeEach(async () => {
  testMongo = await setup.beforeEach();
});

afterEach(() => setup.afterEach(testMongo));

describe("Test add MovieRating", () => {
  it("should create new movieRating object for currently logged in user and selected movie", async () => {});
});
