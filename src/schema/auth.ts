const typeDef = `
    type User {
        id: ID!
        username: String!
    }

    type LoginResponse {
        token: String
        user: User
    }

    extend type Query {
        currentUser: User!
    }


    extend type Mutation {
        register(username: String!, password: String!): User!
        login(username: String!, password: String!): LoginResponse!
        logout: String
    }    
`;
export default typeDef;
