const { gql } = require('apollo-server');

module.exports = gql`
    input UserInput {
        username: String!
        email: String!,
        firstname: String!,
        lastname: String!,
        avatarImg: String,
        birthdate: String!,
        password: String!
    }
    input UserUpdatable {
        email: String!,
        firstname: String!,
        lastname: String!,
        avatarImg: String,
        birthdate: String!,
        password: String!
    }
    type User {
        id: String,
        username: String!
        email: String!,
        firstname: String!,
        lastname: String!,
        avatarImg: String,
        birthdate: String!,
        createdAt: String,
        updatedAt: String
    }
    type AuthResponse {
        user: User!,
        token: String!
    }
    type Query {
        message: String
        users: [User]
        auth(username: String!, password: String!): AuthResponse
        user(username: String!): User
    }
    type Mutation {
        message: String
        register(user: UserInput!): AuthResponse
        updateProfile(user: UserUpdatable!): User
    }
`;
