const mongoose = require('mongoose');

const { Schema } = mongoose;

const challengeSchema = new Schema({
  categorie:{
    type: challengeCategorySchema,
    required: true
  },
  format:{
    type: challengeFormatSchema,
    required: true
  },
  theme:{
    type: challengeThemeSchema,
    required: true
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Challenge', challengeSchema);