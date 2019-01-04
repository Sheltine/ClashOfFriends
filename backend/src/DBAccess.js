const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./Schemas/UserSchema');
const { DB_PARAMS, BIRTHDATE_FORMAT } = require('../config');

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

    getUsers() {
        return User.find();
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
}

const connection = new DBAccess(DB_PARAMS);

module.exports = connection;
