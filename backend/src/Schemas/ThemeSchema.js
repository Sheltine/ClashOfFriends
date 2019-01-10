const mongoose = require('mongoose');

const { Schema } = mongoose;

const themeSchema = new Schema({
  name: {
    type: String,
    index: [true, 'A theme name is required.'],
    unique: true,
    required: true,
    validate: {
      validator(e) {
          return /^[A-z0-9<>áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ ]{1,100}$/.test(e);
      },
      message: props => `${props} is not a valid theme name`,
    },
  },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Theme', themeSchema);
