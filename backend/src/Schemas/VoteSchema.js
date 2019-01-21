const mongoose = require('mongoose');

const { Schema } = mongoose;

const voteSchema = new Schema({
    voter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A vote must have an owner'],
    },
    challenge: {
        type: Schema.Types.ObjectId,
        ref: 'Challenge',
        required: [true, 'A vote must belong to a challenge'],
    },
    support: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A vote should support a user'],
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Vote', voteSchema);
