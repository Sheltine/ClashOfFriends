const moment = require('moment');
const connection = require('../DBAccess');
const { BIRTHDATE_FORMAT, DATE_FORMAT } = require('../../config');
const { auth, register, update, mustBeAuthenticated } = require('../auth');

module.exports = {
    Query: {
        message: () => 'Hello world !',
        users: (p, a, c) => { mustBeAuthenticated(c); return connection.getUsers(); },
        auth: (p, a) => auth(a.username, a.password),
        user: (p, a, c) => { mustBeAuthenticated(c); return connection.getUser({ username: a.username }); },
    },
    Mutation: {
        message: () => 'Hello mutation !',
        register: (_, { user }) => register(user),
        updateProfile: (_, { user }, c) => { mustBeAuthenticated(c); return update(c.user, user); },
        follow: (_, { username }, c) => { mustBeAuthenticated(c); return connection.addFollower(c.user, username); },
        unfollow: (_, { username }, c) => { mustBeAuthenticated(c); return connection.removeFollower(c.user, username); },
    },
    User: {
        followers: u => connection.getFollowers(u.id),
        following: u => u.following.map(id => connection.getUser({ _id: id })),
        birthdate: u => moment(u.birthdate).format(BIRTHDATE_FORMAT),
        createdAt: u => moment(u.createdAt).format(DATE_FORMAT),
        updatedAt: u => moment(u.updatedAt).format(DATE_FORMAT),
    },
};
