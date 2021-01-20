const typeDef = `
    scalar Date

    type Movie {
        _id: ID!
        name: String!
        release: Date!
        duration: Int!
        actors: String!
        average_rating: String
    }

    extend type Query {
        movies(selectedSortField: String, direction: Int): [Movie]!
    }

    extend type Mutation {
        addMovie(name: String!, release: Date!, duration: Int!, actors: String!): Movie!
        updateMovie(_id: ID!, name: String!, release: Date!, duration: Int!, actors: String!): Movie!
        deleteMovie(_id: ID!): Boolean
    }    
`;
export default typeDef;
