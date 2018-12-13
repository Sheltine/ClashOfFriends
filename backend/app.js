// Loads environment variables
require('dotenv/config');
const { ApolloServer, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const connection = require('./src/DBAccess');
const { jwtOptions } = require('./config');
const typeDefs = require('./src/GraphQL/TypeDefs');
const resolvers = require('./src/GraphQL/Resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        if (req.headers.authorization != null) {
            const providedToken = req.headers.authorization.substring('bearer '.length);
            const jwtPayload = jwt.verify(providedToken, jwtOptions.secret);
            return connection.getUser({ _id: jwtPayload.userId }).then((user) => {
                if (user != null) {
                    return { user };
                }
                throw new AuthenticationError('You must provide a valid token.');
            });
        }
    },
    // TODO: Launch in prod: uncomment the following
    // debug: false,

    /*
    formatError: (error) => {
        console.log(error);
        if (error.message.indexOf('duplicate key') !== -1) {
            if (error.message.indexOf('ClashOfFriends.users') !== -1) {
                if (error.message.indexOf('username') !== -1) {
                    throw new UserInputError('This username is already taken', { username: 'test' });
                }
                if (error.message.indexOf('email') !== -1) {
                    return new UserInputError('This email is already taken.');
                }
            }
        } else {
            return new Error(`Internal server error: ${error}`);
            // Or, you can delete the exception information
            // delete error.extensions.exception;
            // return error;
        }
      },
      */

    // Default configuration in development
    // introspection: true,
    // playground: true,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
