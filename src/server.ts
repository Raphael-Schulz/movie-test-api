import mongoose from "mongoose";
import yargs from "yargs";
import { ApolloServer } from "apollo-server-express";
import { getUserInfo } from "./auth";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import express from "express";
import cors from "cors";
const cookieParser = require("cookie-parser");

//Set correct server origin in production environment
const corsOptions = {
  origin: true,
  credentials: true,
};

const args = yargs.option("mongo-uri", {
  describe: "Mongo URI",
  default: "mongodb://localhost:27017/movies",
  type: "string",
  group: "Mongo",
}).argv;

async function start() {
  try {
    await mongoose.connect(args["mongo-uri"], {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
    console.log("Connected to DB.");

    const server = await new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req /*res*/ }) => ({
        userInfo: getUserInfo(req.headers.authorization || ""),
        /*userInfo: getUserInfo(req),
        res: res,*/
      }),
    });

    const app = express();
    app.use(cors(corsOptions));
    app.use(cookieParser());
    server.applyMiddleware({ app, path: "/graphql", cors: corsOptions });

    app.listen(3000);
    console.log("GraphQl API running on port 3000.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
