const mongoose = require('mongoose');

const { Schema } = mongoose;

class DBAccess {
    constructor({ user, password, replica1, replica2, replica3, port = 27017, replicaSet, dbName } = {}) {
        mongoose.connect(`mongodb://${user}:${password}@${replica1}:${port},${replica2}:${port},${replica3}:${port}/${dbName}?ssl=true&replicaSet=${replicaSet}&authSource=admin&retryWrites=true`,
        { useNewUrlParser: true });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
        console.log('Connected !');
        });

        this.User = mongoose.model('User', userSchama);

        /*
        this.u = new this.User({username: 'jade', email: 'jade@teste.me', avatarImg: "Encoreuntest.jpg", firstname: 'J', lastname: 'B', password: 'coucou1234', birthdate: Date.now()});
        this.u.save(function (err, u) {
            if (err) return console.error(err);
            console.log(`${ u.username } added to DB !`);
          });
          */
    }

    getUsers() {
        return this.User.find();
    }

    getUser(params) {
        return this.User.findOne(params);
    }
}

const userSchama = new Schema({
    username: { 
        type: String,
        index: [true, "Username is required."],
        required: true },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function(e) {
                return /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,63}$/.test(e);
            },
            message: props => `${ props } is not a valid email address`
        },
        required: [true, "Email is required."] },
    avatarImg: {
        type: String,
        validate: {
            validator: function(i) {
                return i === null || /^[A-z0-9]+\.(jpe?g|png)$/.test(i);
            },
            message: props => `${ props } is not a valid image`
        } },
    firstname: {
        type: String,
        validate: {
            validator: function(f) {
                return /^[A-z\-\ ]+$/.test(f) && f.length <= 35;
            },
            message: props => `${ props } is not a valid fistname`
        } },
    lastname: {
        type: String,
        validate: {
            validator: function(l) {
                return /^[A-z\-\ ]+$/.test(l) && l.length <= 35;
            },
            message: props => `${ props } is not a valid last`
        } },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(p) { return p.length > 8; },
            message: "Message must be >= 8 chars"
        } },
    birthdate: {
        type: Date,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now() },
    lastUpdateDate: {
        type: Date,
        required: true,
        default: Date.now() }
});

module.exports = DBAccess;