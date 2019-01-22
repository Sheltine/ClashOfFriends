const moment = require('moment');
const connection = require('../DBAccess');
const { BIRTHDATE_FORMAT, DATE_FORMAT } = require('../../config');
const { auth, register, update, updatePassword, mustBeAuthenticated } = require('../Auth');

module.exports = {
    Query: {
        message: () => 'Hello query !',
        users: (p, a, c) => { mustBeAuthenticated(c); return connection.getUsers({}, a.first, a.offset); },
        auth: (_, a) => auth(a.username, a.password),
        user: (_, a, c) => { mustBeAuthenticated(c); return connection.getUser({ username: a.username }); },
        categories: (_, a) => connection.getCategories({}, a.first, a.offset),
        themes: (_, a) => connection.getThemes({}, a.first, a.offset),
        formats: (_, a) => connection.getFormats({}, a.first, a.offset),
        format: (_, a) => connection.getFormats({ category: a.category }),
        challenges: (_, a, c) => { mustBeAuthenticated(c); return connection.getChallenges(a.first, a.offset); },
        votables: (_, a, c) => { mustBeAuthenticated(c); return connection.getVotablesChallenges(a.first, a.offset); },
    },
    Mutation: {
        message: () => 'Hello mutation !',
        register: (_, { user }) => register(user),
        updateProfile: (_, { user }, c) => { mustBeAuthenticated(c); return update(c.user, user); },
        changePassword: (_, { oldPassword, newPassword }, c) => { mustBeAuthenticated(c); return updatePassword(c.user, oldPassword, newPassword); },
        follow: (_, { username }, c) => { mustBeAuthenticated(c); return connection.addFollower(c.user, username); },
        unfollow: (_, { username }, c) => { mustBeAuthenticated(c); return connection.removeFollower(c.user, username); },
        challenge: (_, { username, categoryId }, c) => { mustBeAuthenticated(c); return connection.addChallenge(c.user, username, categoryId); },
        acceptChallenge: (_, { challengeId }, c) => { mustBeAuthenticated(c); return connection.acceptChallenge(c.user, challengeId); },
        rejectChallenge: (_, { challengeId }, c) => { mustBeAuthenticated(c); return connection.rejectChallenge(c.user, challengeId); },
        upload: (_, { challengeId, content }, c) => { mustBeAuthenticated(c); return connection.upload(challengeId, content, c.user); },
        comment: (_, { challengeId, message }, c) => { mustBeAuthenticated(c); return connection.addComment(challengeId, message, c.user); },
        vote: (_, { challengeId, supporterId }, c) => { mustBeAuthenticated(c); return connection.addVote(c.user, challengeId, supporterId); },
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
        pendingChallenges: (u, a, c) => ((c.user && c.user.id !== u.id) ? null : connection.getPendingChallenges(u.id, a.first, a.offset)),
        requestedChallenges: (u, a, c) => ((c.user && c.user.id !== u.id) ? null : connection.getRequestedChallenges(u.id, a.first, a.offset)),
        createdAt: u => moment(u.createdAt).format(DATE_FORMAT),
        updatedAt: u => moment(u.updatedAt).format(DATE_FORMAT),
    },
    Comment: {
        owner: c => connection.getUser({ _id: c.owner }),
        createdAt: c => moment(c.createdAt).format(DATE_FORMAT),
        updatedAt: c => moment(c.updatedAt).format(DATE_FORMAT),
    },
    ChallengeInput: {
        content: i => i.media,
        uploadedAt: i => moment(i.uploadedAt).format(DATE_FORMAT),
        updatedAt: i => moment(i.updatedAt).format(DATE_FORMAT),
    },
    ChallengeSide: {
        user: s => connection.getUser({ _id: s.user }),
        uploadDateStart: s => moment(s.uploadDateStart).format(DATE_FORMAT),
        uploadDateEnd: s => moment(s.uploadDateEnd).format(DATE_FORMAT),
        numberVotes: s => connection.getNumberVoteForChallengeSide(s.id),
    },
    Challenge: {
        challenger: c => c.challengerSide,
        challenged: c => c.challengedSide,
        theme: c => connection.getTheme({ _id: c.theme }),
        category: c => connection.getCategory({ _id: c.category }),
        format: c => connection.getFormat({ _id: c.format }),
        comments: (c, a) => connection.getComments({ challenge: c.id }, a.first, a.offset),
        forWhomDidIVote: (c, a, context) => connection.getVotedUser(c.id, context.user.id),
        voteDateStart: c => (c.voteDateStart ? moment(c.voteDateStart).format(DATE_FORMAT) : null),
        voteDateEnd: c => (c.voteDateEnd ? moment(c.voteDateEnd).format(DATE_FORMAT) : null),
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
        categories: (f, a) => f.categories.map(id => connection.getCategories({ _id: id }, a.first, a.offset)),
        createdAt: f => moment(f.createdAt).format(DATE_FORMAT),
        updatedAt: f => moment(f.updatedAt).format(DATE_FORMAT),
    },
};
