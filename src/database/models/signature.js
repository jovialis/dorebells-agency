/**
 * Created on 12/7/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const uuid = require('uuid');
const shortid = require('shortid');

const signatureSchema = new mongoose.Schema({
    /**
     * Identifiers
     */
    // Unique identifier for the signature
    uid: {
        type: String,
        default: uuid.v4,
        required: true,
        unique: true
    },

    /**
     * Relations
     */
    petition: {
        type: mongoose.Types.ObjectId,
        ref: 'Petition',
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Optional The other user's Signature that referred our user
    referrer: {
        type: mongoose.Types.ObjectId,
        ref: 'Signature',
        default: null
    },

    /**
     * Content
     */
    // Optional user comment on the petition.
    comment: {
        type: String,
        default: null
    },
    // Code that this user can use to share the petition and have subsequent signings attributed to them.
    referralCode: {
        type: String,
        default: shortid.generate,
        required: true
    },
    // People who have liked this signature (usually liking a comment)
    likes: {
        required: true,
        default: [],
        type: [new mongoose.Schema({
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now,
                required: true
            }
        })]
    },

    /**
     * Metadata
     */
    createdOn: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    collection: 'signatures'
});

mongoose.model('Signature', signatureSchema);