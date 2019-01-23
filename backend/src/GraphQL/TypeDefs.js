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
    type Vote {
        voter: User,
        createdAt: String,
        updatedAt: String
    }
    type Comment {
        message: String,
        owner: User,
        createdAt: String,
        updatedAt: String
    }
    type ChallengeInput {
        content: String,
        uploadedAt: String,
        updatedAt: String
    }
    type ChallengeSide {
        user: User,
        uploadDateStart: String,
        uploadDateEnd: String,
        input: ChallengeInput,
        numberVotes: Int,
    }
    type Challenge {
        id: String,
        challenger: ChallengeSide,
        challenged: ChallengeSide,
        category: Category,
        theme: Theme,
        format: Format,
        comments(first: Int, offset: Int): [Comment],
        uploadTime: Int,
        voteDateStart: String,
        voteDateEnd: String,
        createdAt: String,
        updatedAt: String,
        forWhomDidIVote: User,
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
    type Stats {
        numberWin: Int,
        numberLoose: Int,
        numberVotes: Int
    }
    type Query {
        message: String
        users(first: Int, offset: Int): [User]
        auth(username: String!, password: String!): AuthResponse
        user(username: String!): User
        categories(first: Int, offset: Int): [Category]
        themes(first: Int, offset: Int): [Theme]
        formats(first: Int, offset: Int): [Format]
        format(category: String!): [Format]
        challenges(first: Int, offset: Int): [Challenge]
        votables(first: Int, offset: Int): [Challenge]
        stats(userId: String!): Stats
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
        upload(challengeId: String!, content: String!): Challenge
        comment(challengeId: String!, message: String!): Challenge
        vote(challengeId: String!, supporterId: String!): Challenge
    }
`;
