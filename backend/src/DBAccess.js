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
            console.log(`${u.username} added to DB !`);
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
        return User.findOneAndUpdate({ _id: userId }, params, { new: true, runValidators: true }).then((user, err) => {
            if (err) {
                console.error(err);
                return err;
            }
            console.log(`${params.username} updated in DB ! `);
            return user;
        });
    }
}

const connection = new DBAccess(DB_PARAMS);

module.exports = connection;
