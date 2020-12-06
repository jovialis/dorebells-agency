/**
 * Created on 12/3/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const shortid = require('shortid');

/**
 * Represents a generic authenticator. Must be implemented by inheriting.
 * @type {module:mongoose.Schema}
 */
const authenticatorSchema = new mongoose.Schema({
    /**
     * Identification
     */
    // Unique ID
    uid: {
        type: String,
        default: shortid.generate,
        required: true,
        unique: true
    },
    // User that's being authenticated
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    /**
     * Metadata
     */
    // Creation date
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    collection: 'authenticators'
});

const Authenticator = mongoose.model('Authenticator', authenticatorSchema);

/**
 * Represents authentication with a Google account.
 * @type {module:mongoose.Schema}
 */
const googleAuthenticatorSchema = new mongoose.Schema({
    /**
     * Identifiers
     */
    // Google unique identifier
    googleAccountId: {
        type: String,
        required: true,
        unique: true
    }
});

Authenticator.discriminator('GoogleAuthenticator', googleAuthenticatorSchema);