const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./Schemas/UserSchema');
const Category = require('./Schemas/CategorySchema');
const Theme = require('./Schemas/ThemeSchema');
const Format = require('./Schemas/FormatSchema');
const Challenge = require('./Schemas/ChallengeSchema');
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
        Promise.all([this.getCategory({ name: 'Audio' }), this.getCategory({ name: 'Vidéo' })]).then((d, err) => {
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

    getUsers(params) {
        return User.find(params);
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

    getFollowers(userId) {
        return User.find({ following: userId });
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
            if (isNaN(random)) {
                console.log('Problem when getting random number !');
            }
            return Format.findOne({ categories: cat.id }).skip(random);
        });
    }

    getRandomTheme() {
        // Get the count of all Themes
        return Theme.find().estimatedDocumentCount().then((count) => {
            console.log(count);
            // Get a random entry
            const random = getRandomValueFromZero(count);
            if (isNaN(random)) {
                console.log('Problem when getting random number !');
            }
            // Again query all theme but only fetch one offset by our random #
            return Theme.findOne().skip(random).then((result, err) => {
                // Tada! random theme
                return result;
            });
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
                    console.log(`${cat.uploadDurationMin} <= ${uploadTime} <= ${cat.uploadDurationMax}`);

                    if (!format) {
                        console.log(`There is no format for this category (${cat})`);
                        throw new Error(`There is no format for this category (${cat})`);
                    }
                    console.log(`Format: ${format}`);

                    if (!theme) {
                        console.log('No theme chosen');
                        throw new Error('No theme chosen');
                    }
                    console.log(`Theme: ${theme}`);

                    if (!uploadTime) {
                        console.log(`There is no uploadTime for this category (${cat})`);
                        throw new Error(`There is no uploadTime for this category (${cat})`);
                    }
                    console.log(`UploadTime: ${uploadTime}`);

                    const challenge = new Challenge({
                        challengerSide: {
                            user,
                            uploadStartdate: new Date(),
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
                    return user;
                });
            });
        });
    }

    getOneCategory(params) {
        return Category.findOne(params);
    }

    getCategory(params) {
        return Category.find(params);
    }

    getOneTheme(params) {
        return Theme.findOne(params);
    }

    getTheme(params) {
        return Theme.find(params);
    }

    getOneFormat(params) {
        return Format.findOne(params);
    }

    getFormat(params) {
        return Format.find(params);
    }

    /**
     * This means challenges that are initiated by the user but where isAccepted is false
     */
    getPendingChallenges(userId) {
        return Challenge.find({ isAccepted: false, 'challengerSide.user': userId }).then((d) => {
            console.log(d);
            return d;
        });
    }
}

const connection = new DBAccess(DB_PARAMS);

module.exports = connection;
