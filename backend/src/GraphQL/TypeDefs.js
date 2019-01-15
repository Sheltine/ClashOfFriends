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
    input UserUpdate {
        username: String!
        email: String!,
        firstname: String!,
        lastname: String!,
        avatarImg: String,
        birthdate: String!
    }
    type User {
        id: String,
        username: String!
        email: String!,
        firstname: String!,
        lastname: String!,
        avatarImg: String,
        birthdate: String!,
        followers: [User],
        following: [User],
        createdAt: String,
        updatedAt: String
    }
    type Category {
        id: String,
        name: String,
        fileType: [String],
        uploadDurationMin: Int,
        uploadDurationMax: Int,
        voteDurationMin: Int,
        voteDurationMax: Int,
        createdAt: String,
        updatedAt: String
    }
    type Theme {
        id: String,
        name: String,
        createdAt: String,
        updatedAt: String
    }
    type Format {
        id: String,
        name: String,
        categories: [Category],
        createdAt: String,
        updatedAt: String
    }
    type AuthResponse {
        user: User!,
        token: String!
    }
    type Challenge {
        x: String
    }
    type Query {
        message: String
        users: [User]
        auth(username: String!, password: String!): AuthResponse
        user(username: String!): User
        categories: [Category]
        themes: [Theme]
        formats: [Format]
        format(category: String!): [Format]
    }
    type Mutation {
        message: String
        register(user: UserInput!): AuthResponse
        updateProfile(user: UserUpdate!): User
        changePassword(oldPassword: String!, newPassword: String!): User
        follow(username: String!): User
        unfollow(username: String!): User
        challenge(username: String!, categoryId: String!): User
        acceptChallenge(challengeId: String!): Challenge
        rejectChallenge(challengeId: String!): Challenge
    }
`;
