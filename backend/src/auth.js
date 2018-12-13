const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const connection = require('./DBAccess');
const { jwtOptions } = require('../config');

function issueToken({ id, username }) {
    const token = jwt.sign({ userId: id, username }, jwtOptions.secret);
    return token;
}

function thowErrorIfNull(param, paramName) {
    if (param === null) {
        throw new Error(`${paramName} cannot be null.`);
    }
}

function auth(username, password) {
    if (username === null || password === null) {
        throw new Error('Username/password must be defined.');
    }

    return connection.getUser({ username, password }).then((u) => {
        if (u === null) {
            throw new Error('Not found');
        }
        return { token: issueToken({ id:u.id, username: u.username }), user: u };
    });
}

function register(args) {
    thowErrorIfNull(args.username, 'Username');
    thowErrorIfNull(args.email, 'Email');
    thowErrorIfNull(args.firstname, 'Firstname');
    thowErrorIfNull(args.lastname, 'Lastname');
    thowErrorIfNull(args.password, 'Password');
    thowErrorIfNull(args.birthdate, 'Birthdate');
    return connection.addUser(args).then((u, err) => {
        console.log(`success: ${u}`);
        console.log(`error: ${err}`);
        if (undefined === u.id) {
            throw new Error(u);
        }
        return { token: issueToken({ id: u.id, username: u.username }), user: u };
    });
}

function update(u) {
    console.log(`Coucou ${u}`);
}

function mustBeAuthenticated(context) {
    if (!context.user) throw new AuthenticationError('You must provide a valid token.');
    console.log(`${context.user.username} authenticated`);
}

module.exports = { auth, register, update, mustBeAuthenticated };
