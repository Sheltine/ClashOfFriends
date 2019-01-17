const moment = require('moment');
const connection = require('../DBAccess');
const { BIRTHDATE_FORMAT, DATE_FORMAT } = require('../../config');
const { auth, register, update, mustBeAuthenticated } = require('../Auth');

module.exports = {
    Query: {
        message: () => 'Hello world !',
        users: (p, a, c) => { mustBeAuthenticated(c); return connection.getUsers(); },
        auth: (p, a) => auth(a.username, a.password),
        user: (p, a, c) => { mustBeAuthenticated(c); return connection.getUser({ username: a.username }); },
        categories: () => connection.getCategory(),
        themes: () => connection.getTheme(),
        formats: () => connection.getFormat(),
        format: (p, a) => connection.getFormat({ category: a.category }),
        challenges: (p, a, c) => { mustBeAuthenticated(c); return connection.getChallenges(); },
    },
    Mutation: {
        message: () => 'Hello mutation !',
        register: (_, { user }) => register(user),
        updateProfile: (_, { user }, c) => { mustBeAuthenticated(c); return update(c.user, user); },
        changePassword: (_, { oldPassword, newPassword }, c) => { mustBeAuthenticated(c); return connection.changeUserPassword(c.user, oldPassword, newPassword); },
        follow: (_, { username }, c) => { mustBeAuthenticated(c); return connection.addFollower(c.user, username); },
        unfollow: (_, { username }, c) => { mustBeAuthenticated(c); return connection.removeFollower(c.user, username); },
        challenge: (_, { username, categoryId }, c) => { mustBeAuthenticated(c); return connection.addChallenge(c.user, username, categoryId); },
        acceptChallenge: (_, { challengeId }, c) => { mustBeAuthenticated(c); return connection.acceptChallenge(c.user, challengeId); },
        rejectChallenge: (_, { challengeId }, c) => { mustBeAuthenticated(c); return connection.rejectChallenge(c.user, challengeId); },
    },
    User: {
        followers: u => connection.getFollowers(u.id),
        following: u => u.following.map(id => connection.getUser({ _id: id })),
        birthdate: u => moment(u.birthdate).format(BIRTHDATE_FORMAT),
        pendingChallenges: (u, _, c) => {
            return c.user.id === u.id ? connection.getPendingChallenges(u.id) : null;
        },
        requestedChallenges: (u, _, c) => {
            return c.user.id === u.id ? connection.getRequestedChallenges(u.id) : null;
        },
        createdAt: u => moment(u.createdAt).format(DATE_FORMAT),
        updatedAt: u => moment(u.updatedAt).format(DATE_FORMAT),
    },
    Challenge: {
        challenger: c => connection.getUser({ _id: c.challengerSide.user }),
        challenged: c => connection.getUser({ _id: c.challengedSide.user }),
        theme: c => connection.getOneTheme({ _id: c.theme }),
        category: c => connection.getOneCategory({ _id: c.category }),
        format: c => connection.getOneFormat({ _id: c.format }),
        createdAt: c => moment(c.createdAt).format(DATE_FORMAT),
        updatedAt: c => moment(c.updatedAt).format(DATE_FORMAT),
    },
    Category: {
        createdAt: c => moment(c.createdAt).format(DATE_FORMAT),
        updatedAt: c => moment(c.updatedAt).format(DATE_FORMAT),
    },
    Theme: {
        createdAt: t => moment(t.createdAt).format(DATE_FORMAT),
        updatedAt: t => moment(t.updatedAt).format(DATE_FORMAT),
    },
    Format: {
        categories: f => f.categories.map(id => connection.getCategory({ _id: id })),
        createdAt: f => moment(f.createdAt).format(DATE_FORMAT),
        updatedAt: f => moment(f.updatedAt).format(DATE_FORMAT),
    },
};
