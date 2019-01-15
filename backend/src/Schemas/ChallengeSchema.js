const mongoose = require('mongoose');

const { Schema } = mongoose;

const votesSchema = new Schema({
  voter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A vote must have an owner'],
  },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

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
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const userInput = new Schema({
  media: {
    type: String,
    required: [true, 'An input must have a media'],
    description: 'Can be a text or a link to a resource',
  },
}, { timestamps: { createdAt: 'uploadedAt', updatedAt: 'updatedAt' } });
/**
 * This schema defines what a user input for a challenge
 */
const userChallengeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'An input must be linked by a user.'],
  },
  input: userInput,
  votes: [votesSchema],
  uploadStartdate: Date,
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

/**
 * A challenge involves 2 users, a challenger and a challenged.
 * It concerns a specific category: texte, picture, video, sound
 * For each category is defined a format (for example):
 *    * texte: < 20 chars, < 80 chars, > 200 chars,...
 *    * picture: squared, black'n white
 *    * video: < 5 secs, < 20 secs, > 60 secs
 *    * sound: same as video
 * It has a specific theme: humour (black, yellow,...), love, beauty, hate, friendship, lazyness...
 * Upload and vote times are generated according the min and max values defined by the category. Thoses values are stored here.
 */
const challengeSchema = new Schema({
  challengerSide: {
    type: userChallengeSchema,
    required: [true, 'A challenge must be intiated by someone'],
  },
  challengedSide: {
    type: userChallengeSchema,
    required: [true, 'A challenge must be intiated by someone'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'A challenge must concern a category.'],
  },
  format: {
    type: Schema.Types.ObjectId,
    ref: 'Format',
    required: [true, 'A challenge must have a specific format'],
  },
  theme: {
    type: Schema.Types.ObjectId,
    ref: 'Theme',
    required: [true, 'A challenge must be defined over a theme'],
  },
  comments: [commentsSchema],
  uploadTime: {
    type: Number,
    required: [true, 'A challenge must have an upload time'],
  },
  voteDateStart: {
    type: Date,
  },
  voteDateEnd: {
    type: Date,
  },
  isAccepted: {
    type: Boolean,
    default: false,
    timestamps: { createdAt: 'respondedAt' },
  },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Challenge', challengeSchema);
