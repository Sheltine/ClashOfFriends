const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./Schemas/UserSchema');
const Category = require('./Schemas/CategorySchema');
const Theme = require('./Schemas/ThemeSchema');
const Format = require('./Schemas/FormatSchema');
const Challenge = require('./Schemas/ChallengeSchema');
const Comment = require('./Schemas/CommentSchema');
const Vote = require('./Schemas/VoteSchema');
const { DB_PARAMS, BIRTHDATE_FORMAT } = require('../config');
const { getRandomValueFromZero, getRandomValueFromMin } = require('./Utils');

class DBAccess {
    constructor({ user, password, replica1, replica2, replica3, port = 27017, replicaSet, dbName } = {}) {
        mongoose.connect(`mongodb://${user}:${password}@${replica1}:${port},${replica2}:${port},${replica3}:${port}/${dbName}?ssl=true&replicaSet=${replicaSet}&authSource=admin&retryWrites=true`,
        { useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log('Connected !');
        });

        /*
        this.u = new User({username: 'amadeous', email: 'ama@teste.me', avatarImg: "Encoreuntest.jpg", firstname: 'J', lastname: 'B', password: 'coucou1234', birthdate: Date.now()});
        this.u.save(function (err, u) {
            if (err) return console.error(err);
            console.log(`${u.username} added to DB !`);
          });
        */

        /*
        this.t = new Theme({ name: 'Impatience' });
        this.t.save().then((err, t) => {
            if (err) return console.error(err);
            console.log(`Theme ${t.name} added to DB !`);
        });
        */

        /*
        Promise.all([this.getCategories({ name: 'Audio' }), this.getCategories({ name: 'Vidéo' })]).then((d, err) => {
            const audio = d[0][0];
            const video = d[1][0];
            console.log(audio);
            console.log(video);
            this.f = new Format();
            this.f.name = '< 45 secondes';
            this.f.categories.push(audio);
            this.f.categories.push(video);
            this.f.save().then((format, err2) => {
                if (err2) return console.error(err2);
                console.log(`Format ${format.name} added to DB`);
            });
        });
        */
    }

    convertToUser(params) {
        return new User({
            username: params.username,
            email: params.email,
            firstname: params.firstname,
            lastname: params.lastname,
            avatarImg: params.avatarImg,
            birthdate: moment(params.birthdate, BIRTHDATE_FORMAT).toDate(),
            password: params.password,
        });
    }

    getUsers(params, _first, _offset) {
        const query = User.find(params);
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    getUser(params) {
        return User.findOne(params);
    }

    addUser(params) {
        const u = this.convertToUser(params);
        return u.save().then((user, err) => {
            if (err) {
                console.error(err);
                return err;
            }
            console.log(`${user.username} added to DB ! `);
            return user;
        });
    }

    updateUser(userId, params) {
        const newParams = params;
        newParams.birthdate = moment(params.birthdate, BIRTHDATE_FORMAT).toDate();
        return User.findOneAndUpdate({ _id: userId }, newParams, { new: true, runValidators: true }).then((user, err) => {
            if (err) {
                console.error(err);
                return err;
            }
            console.log(`${params.username} updated in DB ! `);
            return user;
        });
    }

    changeUserPassword(u, oldPassword, newPassword) {
        return User.findOneAndUpdate({ _id: u.id, password: oldPassword }, { password: newPassword }, { runValidators: true })
            .then((user, err) => {
                if (err) {
                    console.error(err);
                    return err;
                }
                if (user === null) {
                    console.log(`${u.username} failed to change password (wrong old password)`);
                    return new Error('Wrong password');
                }
                console.log(`Password changed for ${user.username}`);
                return user;
        });
    }

    getFollowers(userId, _first, _offset) {
        const query = User.find({ following: userId });
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    addFollower(followingUser, followedUsername) {
        if (followingUser.username === followedUsername) {
            return new Error(`${followingUser.username} cannot follow itself`);
        }
        return this.getUser({ username: followedUsername }).then((user, err) => {
            if (err) {
                console.error(err);
                return new Error('Cannot find a user with this username');
            }

            // We check if this user does not already follow this user
            followingUser.following.forEach((f) => {
                if (f.toString() === user.id) {
                    throw new Error(`${followingUser.username} already follows ${followedUsername}`);
                }
            });
            followingUser.following.push(user);
            return followingUser.save().then((u, e) => {
                if (e) {
                    console.error(e);
                    return e;
                }
                console.log(`${u.username} now follows ${followedUsername}`);
                return u;
            });
        });
    }

    removeFollower(unfollowingUser, notAnyMoreFollowedUsername) {
        if (unfollowingUser.username === notAnyMoreFollowedUsername) {
            return new Error(`${unfollowingUser.username} cannot follow itself`);
        }

        return this.getUser({ username: notAnyMoreFollowedUsername }).then((user, err) => {
            if (err) {
                console.error(err);
                return new Error('Cannot find a user with this username');
            }

            // We check if this user does follow this user or not
            for (let i = 0; i < unfollowingUser.following.length; i += 1) {
                if (unfollowingUser.following[i].toString() === user.id) {
                    unfollowingUser.following.splice(i, 1);
                    return unfollowingUser.save().then((u, e) => {
                        if (e) {
                            console.error(e);
                            return e;
                        }
                        console.log(`${u.username} does not follows ${notAnyMoreFollowedUsername} any more`);
                        return u;
                    });
                }
            }
            throw new Error(`${unfollowingUser.username} does not follow ${notAnyMoreFollowedUsername}`);
        });
    }

    /*
     * Inspired by https://stackoverflow.com/questions/39277670/how-to-find-random-record-in-mongoose
     */
    getRandomFormat(cat) {
        return Format.find({ categories: cat.id }).countDocuments().then((count) => {
            const random = getRandomValueFromZero(count);
            if (isNaN(random) || random === undefined) {
                console.log('Problem when getting random number !');
            }
            return Format.findOne({ categories: cat.id }).skip(random);
        });
    }

    getRandomTheme() {
        // Get the count of all Themes
        return Theme.find().estimatedDocumentCount().then((count) => {
            // Get a random entry
            const random = getRandomValueFromZero(count);
            if (isNaN(random) || random === undefined) {
                console.log('Problem when getting random number !');
            }
            // Again query all theme but only fetch one offset by our random #
            return Theme.findOne().skip(random);
        });
    }

    addChallenge(user, username, categoryId) {
        return Category.findOne({ _id: categoryId }).then((cat) => {
            if (!cat) {
                console.log(`The category ${cat} does not exists`);
                return new Error('Category not found.');
            }
            console.log(cat.name);

            return this.getUser({ username }).then((challenged) => {
                if (!challenged) {
                    console.log(`The user ${username} does not exists`);
                    return new Error('Challenged user not found.');
                }

                return Promise.all([this.getRandomFormat(cat), this.getRandomTheme()]).then((d) => {
                    const format = d[0];
                    const theme = d[1];

                    const uploadTime = getRandomValueFromMin(cat.uploadDurationMin, cat.uploadDurationMax);

                    if (!format) {
                        console.log(`There is no format for this category (${cat})`);
                        throw new Error(`There is no format for this category (${cat})`);
                    }

                    if (!theme) {
                        console.log('No theme chosen');
                        throw new Error('No theme chosen');
                    }

                    if (!uploadTime) {
                        console.log(`There is no uploadTime for this category (${cat})`);
                        throw new Error(`There is no uploadTime for this category (${cat})`);
                    }

                    const now = new Date();
                    const challenge = new Challenge({
                        challengerSide: {
                            user,
                            uploadDateStart: now,
                            uploadDateEnd: moment(now).add(uploadTime, 'minutes').add(2, 'seconds').toDate(),
                        },
                        challengedSide: {
                            user: challenged,
                        },
                        category: cat,
                        theme,
                        format,
                        uploadTime,
                    });
                    challenge.save().then((c, err) => {
                        if (err) return console.error(err);
                        console.log(`Challenge from ${challenge.challengerSide.user.username} to ${challenge.challengedSide.user.username} added to DB !`);
                    });
                    return this.getUser({ _id: user.id });
                });
            });
        });
    }

    getChallenge(params) {
        return Challenge.findOne(params);
    }

    getCategory(params) {
        return Category.findOne(params);
    }

    getCategories(params, _first, _offset) {
        const query = Category.find(params);
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    getTheme(params) {
        return Theme.findOne(params);
    }

    getThemes(params, _first, _offset) {
        const query = Theme.find(params);
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    getFormat(params) {
        return Format.findOne(params);
    }

    getFormats(params, _first, _offset) {
        const query = Format.find(params);
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    getChallenges(_first, _offset) {
        const query = Challenge.find({
            'challengerSide.input': { $exists: true },
            'challengedSide.input': { $exists: true },  // Possible qu'il faille enlever cette ligne pour récupérer les challenges de défaites par non participation du challenged
            'challengedSide.uploadDateEnd': { $lte: new Date() },
        });
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    getVotablesChallenges(_first, _offset) {
        const now = new Date();
        const query = Challenge.find({ voteDateStart: { $lte: now }, voteDateEnd: { $gte: now } });
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    /**
     * This means challenges that are initiated by the user but where isAccepted is null
     */
    getPendingChallenges(userId, _first, _offset) {
        const query = Challenge.find({ isAccepted: null, answerTime: null, 'challengerSide.user': userId });
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    getRequestedChallenges(userId, _first, _offset) {
        const query = Challenge.find({ isAccepted: null, answerTime: null, 'challengedSide.user': userId });
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    acceptChallenge(user, challengeId) {
        return Challenge.findOne({ _id: challengeId }).then((chall) => {
            if (!chall) {
                throw new Error('The challenge does not exists');
            }
            if (chall.challengedSide.user != user.id) {
                throw new Error('This user cannot accept this challenge');
            }
            if (chall.isAccepted) {
                throw new Error('This challenge cannot be accepted');
            }

            const now = new Date();
            chall.isAccepted = true;
            chall.answerTime = now;
            chall.challengedSide.uploadDateStart = now;
            chall.challengedSide.uploadDateEnd = moment(now).add(chall.uploadTime, 'minutes').add(2, 'seconds').toDate();

            return chall.save().then((c, e) => {
                if (e) {
                    console.log(e);
                    return e;
                }
                console.log(`Challenge ${chall.id} accepted`);
                return c;
            });
        });
    }

    rejectChallenge(user, challengeId) {
        return Challenge.findOne({ _id: challengeId }).then((chall) => {
            if (!chall) {
                throw new Error('The challenge does not exists');
            }
            if (chall.challengedSide.user != user.id) {
                throw new Error('This user cannot reject this challenge');
            }
            if (chall.isAccepted) {
                throw new Error('This challenge cannot be rejected');
            }

            chall.isAccepted = false;
            chall.answerTime = new Date();
            
            return chall.save().then((c, e) => {
                if (e) {
                    console.log(e);
                    return e;
                }
                console.log(`Challenge ${chall.id} rejected`);
                return c;
            });
        });
    }

    upload(challId, content, user) {
        const whoUploadValues = { CHALLENGER: 0, CHALLENGED: 1 };
        let whoUpload = whoUploadValues.OTHER;

        return this.getChallenge({ _id: challId }).then((chall) => {
            if (!chall) {
                console.log(`Challenge ${challId} not found`);
                throw new Error('Challenge not found');
            }

            if (chall.challengerSide.user == user.id) {
                whoUpload = whoUploadValues.CHALLENGER;
            } else if (chall.challengedSide.user == user.id) {
                whoUpload = whoUploadValues.CHALLENGED;
            } else {
                console.log(`${user.username} tried to upload a file for challenge ${chall.id} but is not concerned`);
                throw new Error('You are not allowed to upload file for this challenge');
            }

            if (!this.hasAcceptedTheChall(whoUpload === whoUploadValues.CHALLENGER ? chall.challengerSide : chall.challengedSide)) {
                throw new Error('You must accept the challenge first');
            }

            if (!this.isInTimeToUpload(whoUpload === whoUploadValues.CHALLENGER ? chall.challengerSide : chall.challengedSide)) {
                throw new Error('You can not upload to this challenge anymore');
            }

            return this.getCategory({ _id: chall.category }).then((cat) => {
                if (!cat) {
                    console.log(`Cat ${cat} not found`);
                    throw new Error('Category not found');
                }

                if (cat.fileType.length !== 0) {
                    // If there is at least one filetype, it is another content to be stored elsewhere
                    console.log('Will be stored elsewhere, later');

                    // content = newPathOfTheContent
                    return null;
                }

                // If no filetype, it is text and we store it directly in the DB

                if (whoUpload === whoUploadValues.CHALLENGER) {
                    // We check if they already uploaded something
                    if (chall.challengerSide.input) {
                        chall.challengerSide.input.media = content;
                    } else {
                        chall.challengerSide.input = { media: content };
                    }
                } else if (whoUpload === whoUploadValues.CHALLENGED) {
                    // We check if they already uploaded something
                    if (chall.challengedSide.input) {
                        chall.challengedSide.input.media = content;
                    } else {
                        chall.challengedSide.input = { media: content };
                    }

                    // If the challenged user uploaded something, the votation are going to take place. We need to set up thoses dates
                    chall.voteDateStart = chall.challengedSide.uploadDateEnd;
                    chall.voteDateEnd = moment(chall.voteDateStart).add(2, 'days').toDate();
                }

                return chall.save().then((savedChall, err) => {
                    if (err) return console.error(err);
                    const string = `Content uploaded by ${whoUpload === whoUploadValues.CHALLENGED ? 'challenged' : 'challenger'}`;
                    console.log(`${string} ${user.username} for challenge ${savedChall.id} !`);
                    return savedChall;
                });
            });
        });
    }

    hasAcceptedTheChall(challengeSide) {
        return challengeSide.uploadDateStart && challengeSide.uploadDateEnd;
    }

    isInTimeToUpload(challengeSide) {
        const now = new Date();
        return challengeSide.uploadDateStart <= now && now <= challengeSide.uploadDateEnd;
    }

    addComment(challengeId, message, user) {
        return this.getChallenge({ _id: challengeId }).then((challenge) => {
            if (!challenge) {
                console.log('Challenge does not exists');
                throw new Error('Challenge not found');
            }

            // A user should not comment on a challenge not ready to be voted if not challenger or challenged (should not be visible)
            if (new Date() < challenge.voteDateStart
                && user.id != challenge.challengerSide.user && user.id != challenge.challengedSide.user) {
                console.log(`Challenge ${challengeId} not ready yet to be commented`);
                throw new Error('Challenge not found');
            }

            const comment = new Comment({ message, owner: user, challenge: challenge.id });
            return comment.save().then((savedComment, err) => {
                if (err) return console.error(err);
                console.log(`${user.username} commented on challenge ${challenge.id} !`);
                return this.getChallenge({ _id: challengeId });
            });
        });
    }

    getComments(params, _first, _offset) {
        const query = Comment.find(params);
        if (_offset && _offset > 0) { query.skip(_offset); }
        if (_first && _first > 0) { query.limit(_first); }
        return query;
    }

    addVote(user, challengeId, supporterId) {
        return Vote.find({ voter: user.id, challenge: challengeId, support: supporterId }).then((v) => {
            if (v.length !== 0) {
                console.log(`User ${user.username} already voted on challenge ${challengeId}`);
                throw new Error('Already voted on this challenge');
            }

            return this.getChallenge({ _id: challengeId }).then((challenge) => {
                if (!challenge) {
                    console.log(`Challenge $${challengeId} does not exist`);
                    throw new Error('Challenge not found');
                }
                if (challenge.challengerSide.user != supporterId && challenge.challengedSide.user != supporterId) {
                    console.log(`User ${user.username} tried to vote for a ${challengeId} not involved in the challenge`);
                    throw new Error('This user is not involved in the challenge');
                }
                if (challenge.challengerSide.user == user.id || challenge.challengedSide.user == user.id) {
                    console.log(`User ${user.username} (${user.id}) tried to vote for ${supporterId} on challenge`);
                    throw new Error('Cannot vote for a challenge you\'re involved in');
                }

                return this.getUser({ _id: supporterId }).then((support) => {
                    if (!support) {
                        console.log(`User ${supporterId} does not exist`);
                        throw new Error('Supported user not found');
                    }
                    console.log(`Support.id: ${support.id}`);
    
                    const vote = new Vote({ voter: user, challenge, support });
                    return vote.save().then((savedVote, err) => {
                        if (err) return console.error(err);
                        console.log(`${user.username} voted for ${support.username} on challenge ${challenge.id} !`);
                        return challenge;
                    });
                });
            });
        });
    }

    getVotedUser(challengeId, voterId) {
        return Vote.findOne({ challenge: challengeId, voter: voterId }).then((vote) => {
            return vote ? this.getUser({ _id: vote.support }) : null;
        });
    }

    /*
     * This way of getting votes is really not optimsed. Could be upgraded if time allows.
     * This would implies to have a better DB
     */
    getNumberVoteForChallengeSide(challengeSideId) {
        return this.getChallenge({ $or: [{ 'challengerSide._id': challengeSideId }, { 'challengedSide._id': challengeSideId }] })
            .then((challenge) => {
            const userId = challengeSideId == challenge.challengerSide.id ? challenge.challengerSide.user : challenge.challengedSide.user;
            return Vote.find({ support: userId, challenge: challenge.id }).count();
        });
    }
}

const connection = new DBAccess(DB_PARAMS);

module.exports = connection;
