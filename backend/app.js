// Loads environment variables
require('dotenv/config');
const moment = require('moment');
const BIRTH_FORMAT = 'DD/MM/YYYY';
const DATE_FORMAT = 'DD/MM/YYY HH:mm:ss'
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
        users: [User]
        userByUsernamePassword(username: String!, password: String!) : User
        userByUsername(username: String!) : User
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
`;

const resolvers = {
    Query: {
        message: () => 'Hello world !',
        users: () => {
            return connection.getUsers();
        },
        userByUsernamePassword: (parent, args) => {
            return connection.getUser({username: args.username, password: args.password});
        },
        userByUsername: (parent, args) => {
            return connection.getUser({username: args.username});
        }
    },
    User : {
        id: (u) => { return u._id.toString(); },
        birthdate: (u) => { return moment(u.birthdate).format(BIRTH_FORMAT); },
        creationDate: (u) => { return moment(u.creationDate).format(DATE_FORMAT); },
        lastUpdateDate: (u) => { return moment(u.lastUpdateDate).format(DATE_FORMAT); }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
    // Default configuration in development
    // introspection: true,
    // playground: true,
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});