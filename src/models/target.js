/**
 * Created by jovialis (Dylan Hanson) on 11/30/20
 **/

const mongoose = require('mongoose');
const shortid = require('shortid');

/**
 * @description Represents a target audience for a petition. Created by each individual government and
 *              assigned by users to their petitions.
 */
const targetSchema = new mongoose.Schema({
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
    user: {
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
    collection: 'targets'
});

mongoose.model('Target', targetSchema);