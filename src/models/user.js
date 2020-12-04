/**
 * Created on 12/3/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const uuid = require('uuid');

/**
 * Represents a registered user and their level of authority.
 * @type {module:mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
    /**
     * Identifiers
     */
    // Unique identifier
    uid: {
        type: String,
        default: uuid.v4,
        required: true,
        unique: true
    },
    // Email address
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    /**
     * Authenticator
     */
    // Whatever form of authentication the user uses to sign in.
    authenticator: {
        type: mongoose.Types.ObjectId,
        ref: 'Authenticator',
        required: true
    },

    /**
     * Details
     */
    // What roles the user has. This can have roles from multiple different governments.
    roles: [{
        type: mongoose.Types.ObjectId,
        ref: 'Role',
        required: true,
        default: []
    }],

    /**
     * Metadata
     */
    // Last time the user logged in
    lastLogin: {
        type: Date,
        default: Date.now,
        required: true
    },
    // When the user first logged in
    firstLogin: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    collection: 'users'
});

mongoose.model('User', userSchema);