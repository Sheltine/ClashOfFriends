const mongoose = require('mongoose');

const modelName = 'User';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        index: [true, 'Username is required.'],
        unique: true,
        required: true },
    email: {
        type: String,
        unique: true,
        validate: {
            validator(e) {
                return /^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,63}$/.test(e);
            },
            message: props => `${props} is not a valid email address`,
        },
        required: [true, 'Email is required.'] },
    avatarImg: {
        type: String,
        validate: {
            validator(i) {
                return i === null || /^[A-z0-9]+\.(jpe?g|png)$/.test(i);
            },
            message: props => `${props} is not a valid image`,
        } },
    firstname: {
        type: String,
        validate: {
            validator(f) {
                return /^[A-z\-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ ]+$/.test(f) && f.length <= 35;
            },
            message: props => `${props} is not a valid fistname`,
        } },
    lastname: {
        type: String,
        validate: {
            validator(l) {
                return /^[A-z\-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ ]+$/.test(l) && l.length <= 35;
            },
            message: props => `${props} is not a valid last`,
        } },
    password: {
        type: String,
        required: true,
        validate: {
            validator(p) { return p.length > 8; },
            message: 'Message must be >= 8 chars',
        } },
    birthdate: {
        type: Date,
        required: true,
    },
    following: [{ type: Schema.Types.ObjectId, ref: modelName }],
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model(modelName, userSchema);
