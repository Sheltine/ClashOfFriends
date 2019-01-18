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
        followers(first: Int, offset: Int): [User],
        following(first: Int, offset: Int): [User],
        pendingChallenges(first: Int, offset: Int): [Challenge],
        requestedChallenges(first: Int, offset: Int): [Challenge],
        createdAt: String,
        updatedAt: String
    }
    type Challenge {
        id: String,
        challenger: User,
        challenged: User,
        category: Category,
        theme: Theme,
        format: Format,
        uploadTime: Int,
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
        categories(first: Int, offset: Int): [Category],
        createdAt: String,
        updatedAt: String
    }
    type AuthResponse {
        user: User!,
        token: String!
    }
    type Query {
        message: String
        users(first: Int, offset: Int): [User]
        auth(username: String!, password: String!): AuthResponse
        user(username: String!): User
        categories: [Category]
        themes(first: Int, offset: Int): [Theme]
        formats(first: Int, offset: Int): [Format]
        format(category: String!): [Format]
        challenges(first: Int, offset: Int): [Challenge]
        votables(first: Int, offset: Int): [Challenge]
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
