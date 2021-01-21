import mongoose from "mongoose";
import yargs from "yargs";
import { ApolloServer } from "apollo-server";
import { getUserInfo } from "./auth";
import typeDefs from "./schema";
import resolvers from "./resolvers";

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
      subscriptions: {
        onConnect: (connectionParams: any) => {
          const user = getUserInfo(connectionParams.authorization || "");
          if (!user) throw new Error("User not authenticated!");
        },
      },
      context: ({ req }) => ({
        userInfo: getUserInfo((req && req.headers.authorization) || ""),
      }),
    });

    server.listen(3000).then(({ url, subscriptionsUrl }) => {
      console.log(`Server ready at ${url}`);
      console.log(`Subscriptions ready at ${subscriptionsUrl}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
