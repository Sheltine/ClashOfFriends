const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server');
const SHA3 = require('crypto-js/sha256');
const connection = require('./DBAccess');

const { jwtOptions } = require('../config');
const SALT = require('../config');

function issueToken({ id, username }) {
    const token = jwt.sign({ userId: id, username }, jwtOptions.secret);
    return token;
}

function thowErrorIfNull(param, paramName) {
    if (param === null) {
        throw new Error(`${paramName} cannot be null.`);
    }
}

function hashPassword(password) {
    return SHA3(SALT + password).toString();
}

function checkIfUserComplete(u) {
    thowErrorIfNull(u.username, 'Username');
    thowErrorIfNull(u.email, 'Email');
    thowErrorIfNull(u.firstname, 'Firstname');
    thowErrorIfNull(u.lastname, 'Lastname');
    thowErrorIfNull(u.password, 'Password');
    thowErrorIfNull(u.birthdate, 'Birthdate');
}

function auth(username, password) {
    if (username === null || password === null) {
        throw new Error('Username/password must be defined.');
    }

    return connection.getUser({ username, password: hashPassword(password) }).then((u) => {
        if (u === null) {
            throw new Error('Not found');
        }
        return { token: issueToken({ id: u.id, username: u.username }), user: u };
    });
}

function register(args) {
    checkIfUserComplete(args);
    args.password = hashPassword(args.password);
    console.log(args);
    return connection.addUser(args).then((u) => {
        if (undefined === u.id) {
            throw new Error(u);
        }
        return { token: issueToken({ id: u.id, username: u.username }), user: u };
    });
}

function update(himself, newU) {
    checkIfUserComplete(newU);
    // We must check a user cannot change it's username and that it edits its profile
    if (himself.username !== newU.username) {
        throw new ForbiddenError("You cannot edit another user's profile.");
    }

    return connection.updateUser(himself.id, newU).then((user) => {
        if (undefined === user.id) {
            throw new Error(user);
        }
        return user;
    });
}

function updatePassword(user, oldPassword, newPassword) {
    return connection.changeUserPassword(user, hashPassword(oldPassword), hashPassword(newPassword));
}

function mustBeAuthenticated(context) {
    if (!context.user) throw new AuthenticationError('You must provide a valid token.');
    console.log(`${context.user.username} authenticated`);
}

module.exports = { auth, register, update, updatePassword, mustBeAuthenticated };
