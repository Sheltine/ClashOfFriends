const moment = require('moment');
const connection = require('../DBAccess');
const { BIRTHDATE_FORMAT, DATE_FORMAT } = require('../../config');
const { auth, register, update, mustBeAuthenticated } = require('../Auth');

module.exports = {
    Query: {
        message: () => 'Hello query !',
        users: (p, a, c) => { mustBeAuthenticated(c); return connection.getUsers({}, a.first, a.offset); },
        auth: (_, a) => auth(a.username, a.password),
        user: (_, a, c) => { mustBeAuthenticated(c); return connection.getUser({ username: a.username }); },
        categories: (_, a) => connection.getCategory({}, a.first, a.offset),
        themes: (_, a) => connection.getTheme({}, a.first, a.offset),
        formats: (_, a) => connection.getFormat({}, a.first, a.offset),
        format: (_, a) => connection.getFormat({ category: a.category }),
        challenges: (_, a, c) => { mustBeAuthenticated(c); return connection.getChallenges(a.first, a.offset); },
        votables: (_, a, c) => { mustBeAuthenticated(c); return connection.getVotablesChallenges(a.first, a.offset); },
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
        followers: (u, a) => connection.getFollowers(u.id, a.first, a.offset),
        following: (u, a) => {
            let slice = u.following;
            if (a.first && a.first > 0) { slice = slice.slice(a.first); }
            if (a.offset && a.offset > 0) { slice = slice.slice(0, a.offset); }
            return slice.map(id => connection.getUser({ _id: id }));
        },
        birthdate: u => moment(u.birthdate).format(BIRTHDATE_FORMAT),
        pendingChallenges: (u, a, c) => (c.user.id === u.id ? connection.getPendingChallenges(u.id, a.first, a.offset) : null),
        requestedChallenges: (u, a, c) => (c.user.id === u.id ? connection.getRequestedChallenges(u.id, a.first, a.offset) : null),
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
        categories: (f, a) => f.categories.map(id => connection.getCategory({ _id: id }, a.first, a.offset)),
        createdAt: f => moment(f.createdAt).format(DATE_FORMAT),
        updatedAt: f => moment(f.updatedAt).format(DATE_FORMAT),
    },
};
