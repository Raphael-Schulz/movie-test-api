const typeDef = `
    type MovieRating {
        _id: ID!
        movieId: ID!
        rating: Int!
    }

    type SaveMovieRatingResponse {
        movieRating: MovieRating
        movie: Movie
    }

    extend type Query {
        movieRating(movieId: String!): MovieRating
    }

    extend type Mutation {
        saveMovieRating(_id: ID, movieId: String!, rating: Int!): SaveMovieRatingResponse!
    }    
`;
export default typeDef;
