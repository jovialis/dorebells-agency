/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');

/**
 * Represents an instance of a User holding a given role.
 * @type {module:mongoose.Schema}
 */
const roleholderSchema = new mongoose.Schema({
    // The user who holds the role
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // The role that the user holds
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'Role',
        required: true
    },

    // The person who gave them that role. Can be null
    sponsor: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    },

    // When the user was given the role
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },

    // Government in which this role was held.
    // Utility field for fetching roleholding users in a given Government.
    government: {
        type: mongoose.Types.ObjectId,
        ref: 'Government',
        required: true
    },

    // Schema representing the details about the role being removed.
    removal: new mongoose.Schema({
        // The date it was removed
        timestamp: {
            type: Date,
            default: Date.now,
            required: true
        },

        // The user who removed it
        sponsor: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },

        // Optionally, the reason it was removed.
        reason: {
            type: String,
            default: null,
        }
    }, {
        _id: false,
        __v: false
    })
}, {
    collection: 'roleholders'
});

mongoose.model('RoleHolder', roleholderSchema);