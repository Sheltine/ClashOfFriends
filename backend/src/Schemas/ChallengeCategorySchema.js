const mongoose = require('mongoose');
const ChallengeFormat = require('./ChallengeFormatSchema');

const { Schema } = mongoose;

const challengeCategorySchema = new Schema({
    name: {
        type: String,
        index: true,
        unique: true,
        required: [true, 'Name is required.'],
    },
    fileType: {
        type: [String],
    },
    uploadDurationMin: {
        type: Number,
        default: 5,
    },
    uploadDurationMax: {
        type: Number,
        default: 1440,
    },
    format: {
        type: [ChallengeFormat],
        required: [true, 'ChallengeFormat must be defined.'],
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('ChallengeCategory', challengeCategorySchema);
