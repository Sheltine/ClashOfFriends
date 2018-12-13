const mongoose = require('mongoose');

const { Schema } = mongoose;

const challengeThemeSchema = new Schema({
  name:{
    type: String,
    index: [true, 'A theme name is required.'],
    unique: true,
    required: true
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Theme', challengeThemeSchema);