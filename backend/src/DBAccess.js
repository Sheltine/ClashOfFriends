const mongoose = require('mongoose');
const User = require('./Schemas/UserSchema');
const { DB_PARAMS } = require('../config');

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
        this.u = new this.User({username: 'jade', email: 'jade@teste.me', avatarImg: "Encoreuntest.jpg", firstname: 'J', lastname: 'B', password: 'coucou1234', birthdate: Date.now()});
        this.u.save(function (err, u) {
            if (err) return console.error(err);
            console.log(`${ u.username } added to DB !`);
          });
          */
    }

    getUsers() {
        return User.find();
    }

    getUser(params) {
        return User.findOne(params);
    }
}

const connection = new DBAccess(DB_PARAMS);

module.exports = connection;