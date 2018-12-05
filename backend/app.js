// Loads environment variables
require('dotenv/config');
const { ApolloServer, gql } = require('apollo-server');
const DB = require('./src/DBAccess');

connection = new DB({
    replica1: process.env.MONGO_DB_REPLICA_1,
    replica2: process.env.MONGO_DB_REPLICA_2,
    replica3: process.env.MONGO_DB_REPLICA_3,
    user: process.env.MONGO_DB_USER,
    password: process.env.MONGO_DB_PWD,
    port: process.env.MONGO_DB_PORT || 27017,
    replicaSet: process.env.MONGO_DB_REPLICA_SET,
    name: process.env.MONGO_DB_NAME,
});

const typeDefs = gql`
    type Query {
        message: String
    }
`;

const resolvers = {
    Query: {
        message: () => 'Hello world !'
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});