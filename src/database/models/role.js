/**
 * Created on 12/3/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const shortid = require('shortid');

/**
 * Represents a role assignable to a user.
 * @type {module:mongoose.Schema}
 */
const roleSchema = new mongoose.Schema({
    /**
     * Identifiers
     */
    // Unique identifier
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
     * Details
     */
    // Name of the role
    name: {
        type: String,
        required: true,
    },
    // Role color
    color: {
        type: String,
        required: true,
        default: '#000000'
    },
    // What permissions this role has
    permissions: [{
        type: String,
        enum: Object.values(require('../../permissions')),
        default: []
    }],

    /**
     * @mark Metadata
     */
    // Timestamp of the target's creation
    createdOn: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'roles'
});

mongoose.model('Role', roleSchema);