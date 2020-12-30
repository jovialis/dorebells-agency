/**
 * Created by jovialis (Dylan Hanson) on 11/30/20
 **/

const mongoose = require('mongoose');
const shortid = require('shortid');

/**
 * @description Represents a single term of the student government. Created at the start of the school year
 *              by the new government's administrators/chief of staff.
 */
const governmentSchema = new mongoose.Schema({
    /**
     * @mark Identifiers
     */
    // Unique identifier for the government
    uid: {
        type: String,
        default: shortid.generate,
        required: true,
        unique: true
    },

    /**
     * @mark Relationships
     */
    // Administrative user who created this government
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    /**
     * @mark Content
     */
    // Name of the government
    name: {
        type: String,
        required: true,
        unique: true
    },

    /**
     * @mark Metadata
     */
    // Date this government was created
    timestamp: {
        type: Date,
        default: Date.now
    },
    // Whether or not this is the current government
    current: {
        type: Boolean,
        default: false
    },
    // Whether or not this government has been archived
    archived: {
        type: Boolean,
        default: false
    }
}, {
    setDefaultsOnInsert: true,
    collection: 'governments'
});

mongoose.model('Government', governmentSchema);