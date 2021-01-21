import Auth from "./auth";
import Movie from "./movie";
import MovieRating from "./movieRating";

const typeDefs = `
    type Query{
        _empty: String
    }
    type Mutation {
        _empty: String
    }
    type Subscription{
        _empty: String
    }
    ${Auth}
    ${Movie}
    ${MovieRating}
`;
export default typeDefs;
