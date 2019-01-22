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
        return null;
    },

    debug: false,

    // Default configuration in development
    // introspection: true,
    // playground: true,
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
