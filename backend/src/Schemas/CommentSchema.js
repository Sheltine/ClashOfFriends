const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentsSchema = new Schema({
  message: {
    type: String,
    required: [true, 'A comment cannot be empty'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A comment must have an owner'],
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: [true, 'A comment must concern a challenge'],
  },
}, { timestamps: { createdAt: 'createdAt' } });

module.exports = mongoose.model('Comment', commentsSchema);
