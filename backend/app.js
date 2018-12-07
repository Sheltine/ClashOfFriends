// Loads environment variables
require('dotenv/config');
const { auth, register } = require('./src/auth');
const moment = require('moment');
const { ApolloServer, gql } = require('apollo-server');
const connection = require('./src/DBAccess');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('./config');

// Default values
const BIRTH_FORMAT = 'DD/MM/YYYY';
const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';

const typeDefs = gql`
    type Query {
        message: String
        users: [User]
        auth(username: String!, password: String!): AuthResponse!
        register(username: String!, email: String!, firstname: String!, lastname: String!,
                birthdate: String!, password: String!, avatarImg: String): AuthResponse!
        user(username: String!): User
    }
    type User {
        id: String,
        username: String!
        email: String!,
        firstname: String!,
        lastname: String!,
        avatarImg: String,
        birthdate: String!,
        creationDate: String,
        lastUpdateDate: String
    }
    type AuthResponse {
        user: User!,
        token: String!
    }
`;

const resolvers = {
    Query: {
        message: () => 'Hello world !',
        users: () => {
            return connection.getUsers();
        },
        auth: (parent, args) => {
            return auth(args.username, args.password);
        },
        register: (parent, args) => {
            return register(args);
        },
        user: (parent, args, context) => {
            return connection.getUser({username: args.username});
        }
    },
    User : {
        birthdate: (u) => { return moment(u.birthdate).format(BIRTH_FORMAT); },
        creationDate: (u) => { return moment(u.creationDate).format(DATE_FORMAT); },
        lastUpdateDate: (u) => { return moment(u.lastUpdateDate).format(DATE_FORMAT); }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
        // We here mare a verification over the request and we check if access is protected or not
        const obj = gql`${req.query.query}`;
        // We let strict access to auth and register without token
        if (obj.definitions.length === 1 && obj.definitions[0].selectionSet.selections.length === 1 &&
            (obj.definitions[0].selectionSet.selections[0].name.value === 'auth') || 
            (obj.definitions[0].selectionSet.selections[0].name.value === 'register')) {
            console.log("No need to authenticate")
        } else {
            // Otherwise, we need a token
            let userId = null;
            if (null != req.headers.authorization) {
                const providedToken = req.headers.authorization.substring("bearer ".length);
                userId = jwt.verify(providedToken, jwtOptions.secret).userId;
                connection.getUser({_id: userId}).then((d) => {
                    if (null != d)
                        console.log(`Token : Welcome back ${d.username} !`);
                });
            }
            // FIXME: now introspection is not allowed. Comment the following to make it work.
            if (null === userId) {
                console.log("Attempt to use service without auth");
                throw new Error("You need to authenticate");
            }
        }
            
    },

    // Default configuration in development
    // introspection: true,
    // playground: true,
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});

// Changer process.env.nodeenv