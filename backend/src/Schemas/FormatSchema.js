const mongoose = require('mongoose');

const { Schema } = mongoose;

/*
 * Here, we use a simple name to define a format but we could push the project further and define constraints in a verifyiable way
 * (less than n seconds,...).
 * For example, instead of saying : this picture should be black/white, we could define allowed colors to check if valid
 */
const formatSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name of the format must be defined.'],
        validate: {
            validator(e) {
                return /^[A-z0-9<>áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\- ]{1,100}$/.test(e);
            },
            message: props => `${props} is not a valid format name`,
          },
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }],
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

module.exports = mongoose.model('Format', formatSchema);
