/**
 * Created on 12/3/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const shortid = require('shortid');

/**
 * Represents a categorization label for a given petition.
 * @type {module:mongoose.Schema}
 */
const tagSchema = new mongoose.Schema({
    /**
     * @mark Identifiers
     */
    uid: {
        type: String,
        default: shortid.generate,
        required: true,
        unique: true
    },

    /**
     * @mark Relations
     */
    // Represents the administrative user who created this Target
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Government that owns this target
    government: {
        type: mongoose.Types.ObjectId,
        ref: 'Government',
        required: true
    },

    /**
     * @mark Content for the target
     */
    // Display name of the target
    name: {
        type: String,
        required: true,
        unique: true
    },

    /**
     * @mark Metadata
     */
    // Timestamp of the target's creation
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'tags'
});

mongoose.model('Tag', tagSchema);