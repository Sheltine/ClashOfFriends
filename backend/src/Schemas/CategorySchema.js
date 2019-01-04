const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * A category is defined by a name, a set of file format allowed,
 * a upload duration min and max, a vote duration min and max
 */
const categorySchema = new Schema({
    name: {
        type: String,
        index: true,
        unique: true,
        required: [true, 'Name is required.'],
        validate: {
            validator(e) {
                return /^[A-z0-9 ]+$/.test(e);
            },
            message: props => `${props} is not a valid category name`,
          },
    },
    fileType: {
        type: [{
            type: String,
            validate: {
                validator(e) {
                    return /^[A-z0-9]+$/.test(e);
                },
                message: props => `${props} is not a valid fileType name`,
              },
            }],
    },
    uploadDurationMin: {
        type: Number,
        default: 5,
        validate: {
            validator(n) {
                return n > 0;
            },
            message: props => `uploadDurationMin must be strictly positive (got: ${props})`,
        },
    },
    uploadDurationMax: {
        type: Number,
        default: 1440,
        validate: {
            validator(n) {
                return n > 0;
            },
            message: props => `uploadDurationMax must be strictly positive (got: ${props})`,
        },
    },
    voteDurationMin: {
        type: Number,
        default: 5,
        validate: {
            validator(n) {
                return n > 0;
            },
            message: props => `voteDurationMin must be strictly positive (got: ${props})`,
        },
    },
    voteDurationMax: {
        type: Number,
        default: 1440,
        validate: {
            validator(n) {
                return n > 0;
            },
            message: props => `voteDurationMax must be strictly positive (got: ${props})`,
        },
    },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Category', categorySchema);
