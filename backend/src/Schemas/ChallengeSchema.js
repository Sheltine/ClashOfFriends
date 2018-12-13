const mongoose = require('mongoose');
const ChallengeCategorySchema = require('./ChallengeCategorySchema');
const ChallengeFormatSchema = require('./ChallengeFormatSchema');
const ChallengeThemeSchema = require('./ChallengeThemeSchema');

const { Schema } = mongoose;

const challengeSchema = new Schema({
  categorie:{
    type: ChallengeCategorySchema,
    required: true
  },
  format:{
    type: ChallengeFormatSchema,
    required: true
  },
  theme:{
    type: ChallengeThemeSchema,
    required: true
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Challenge', challengeSchema);