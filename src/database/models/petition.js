/**
 * Created by jovialis (Dylan Hanson) on 11/29/20
 **/

const mongoose = require('mongoose');
const shortid = require('shortid');

/**
 * @description Represents a database entry for a Petition.
 */
const petitionSchema = new mongoose.Schema({
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
     * @mark Filing relation
     */
    // User who created the petition
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Who the petition is addressed to
    target: {
        type: mongoose.Types.ObjectId,
        ref: 'Target',
        required: true
    },
    // What government the petition was filed under
    government: {
        type: mongoose.Types.ObjectId,
        ref: 'Government',
        required: true
    },

    /**
     * @mark Petition Content
     */
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // Tags this is filed under
    tags: [{
        type: mongoose.Types.ObjectId,
        ref: 'Tag',
        default: [],
        required: true
    }],

    /**
     * @mark Metadata
     */
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    collection: 'petitions'
});

mongoose.model('Petition', petitionSchema);