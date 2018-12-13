// Loads environment variables
require('dotenv/config');
const moment = require('moment');
const { ApolloServer, gql, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { auth, register } = require('./src/auth');
const connection = require('./src/DBAccess');
const { jwtOptions, BIRTHDATE_FORMAT, DATE_FORMAT } = require('./config');

const typeDefs = gql`
    input UserInput {
        username: String!
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
        register(user: UserInput!): AuthResponse
    }
`;

const resolvers = {
    Query: {
        message: () => 'Hello world !',
        users: () => connection.getUsers(),
        auth: (parent, args) => auth(args.username, args.password),
        user: (parent, args) => connection.getUser({ username: args.username }),
    },
    Mutation: {
        register: (_, { user }) => register(user),
    },
    User: {
        birthdate: u => moment(u.birthdate).format(BIRTHDATE_FORMAT),
        createdAt: u => moment(u.createdAt).format(DATE_FORMAT),
        updatedAt: u => moment(u.updatedAt).format(DATE_FORMAT),
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        // We here make a verification over the request and we check if access is protected or not
        /*
        let authRequired = true;
        if (req.query.query != null) {
            console.log('A query was run');

            const obj = gql`${req.query.query}`;
            const isInspection = obj.definitions.length === 4
                                 && obj.definitions[0].operation === 'query'
                                 && obj.definitions[0].kind === 'OperationDefinition'
                                 && obj.definitions[0].name.value === 'IntrospectionQuery'
                                 && obj.definitions[1].kind === 'FragmentDefinition'
                                 && obj.definitions[1].name.value === 'FullType'
                                 && obj.definitions[2].kind === 'FragmentDefinition'
                                 && obj.definitions[2].name.value === 'InputValue'
                                 && obj.definitions[3].kind === 'FragmentDefinition'
                                 && obj.definitions[3].name.value === 'TypeRef';
            if (isInspection) {
                console.log('Inspection');
            }

            const isAuth = obj.definitions.length === 1
                           && obj.definitions[0].selectionSet.selections.length === 1
                           && obj.definitions[0].selectionSet.selections[0].name.value === 'auth';
            if (isAuth) {
                console.log('Authentification');
            }

            if (isInspection || isAuth) {
                authRequired = false;
            }
        } else if (req.res.req.body != null) {
            console.log('Mutation it seems');
            const obj = gql`${req.res.req.body.query}`;
            const isRegister = obj.definitions.length === 1
                               && obj.definitions[0].operation === 'mutation'
                               && obj.definitions[0].selectionSet.selections.length === 1
                               && obj.definitions[0].selectionSet.selections[0].name.value === 'register';
                
            if (isRegister) {
                console.log('Registration');
                authRequired = false;
            }
        }

        if (authRequired) {
            */
            let userId = null;
            let user = null;
            if (req.headers.authorization != null) {
                const providedToken = req.headers.authorization.substring('bearer '.length);
                userId = jwt.verify(providedToken, jwtOptions.secret).userId;
                user = connection.getUser({ _id: userId }).then((d) => {
                    if (d != null) {
                        console.log(`Token : Welcome back ${d.username} !`);
                        return d;
                    }
                });
                if (user != null) {
                    return { user };
                }
            }
            /*
            if (userId === null) {
                console.log('Attempt to use service without auth');
                throw new AuthenticationError('must authenticate');
            }
        }
        */
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
