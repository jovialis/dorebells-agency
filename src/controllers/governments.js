/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const Government = mongoose.model('Government');

const createError = require('http-errors');

const {optionsQuery, DefaultQueryOptions} = require('../utils/queryOptionsWrapper');

module.exports = {
    // Queries
    getGovernmentByUID,
    listGovernments,
    getPetitionsByGovernmentUID,
    getMembersByGovernmentUID,
    getCurrentGovernment,

    // Mutations
    createGovernment,
    setCurrentGovernment
};

/**
 *
 * @param uid Governments UID to fetch. If null, the results will represent the currently operating government.
 * @param options Specifications to the query.
 *        - lean: Leanify the query (return as JSON)
 *        - select (Array or String): Fields to select from
 *        - populate (Array or String): Fields to populate
 *        None specified returns a default {mongoose.Document}
 * @returns {Promise<Document>}
 */
async function getGovernmentByUID(uid, options = DefaultQueryOptions) {
    let gov;

    if (uid) {
        gov = await optionsQuery(Government.findOne({uid}), options);
    } else {
        gov = await getCurrentGovernment(options);
    }

    if (!gov) {
        throw createError(404, uid ?
            "Government could not be found by that UID."
            : "No currently operating government."
        );
    }

    return gov;
}

/**
 * Lists all available Governments
 * @param options
 * @returns {Promise<[Government]>}
 */
async function listGovernments(options = DefaultQueryOptions) {
    return await optionsQuery(Government.find(), options);
}

/**
 * Returns the currently operating government
 * @param options
 * @returns {Promise<Government>}
 */
async function getCurrentGovernment(options = DefaultQueryOptions) {
    return await optionsQuery(Government.findOne({current: true}), options);
}

/**
 * Fetches all Petitions associated with this Government.
 * @param uid
 * @param options
 * @returns {Promise<Document[]>}
 */
async function getPetitionsByGovernmentUID(uid, options = DefaultQueryOptions) {
    const { _id: governmentDoc } = await getGovernmentByUID(uid, {
        lean: true,
        select: '_id'
    });

    const petitions = require('./petitions');
    return await petitions.getPetitionsByGovernment(governmentDoc, options);
}

/**
 * Fetches all role-holding members of this Government.
 * @param uid Government UID
 * @param options
 * @returns {Promise<void>}
 */
async function getMembersByGovernmentUID(uid, options = DefaultQueryOptions) {
    const { _id: governmentDoc } = await getGovernmentByUID(uid, {
        lean: true,
        select: '_id'
    });

    const users = require('./users');
    return await users.getRoleHoldingUsersByGovernment(governmentDoc, options);
}

/**
 * Creates a new Government with the given name
 * @param user
 * @param name
 * @returns {Promise<Government>}
 */
async function createGovernment(user, {name}) {
    // Make sure there isn't another government with the same name
    if (await Government.countDocuments({name}) > 0) {
        throw createError('Government by that name already exists.');
    }

    return await Government.create({
        name,
        creator: user
    });
}

async function setCurrentGovernment(user, uid) {
    const government = await getGovernmentByUID(uid, {
        select: ['_id']
    });

    const governmentID = government._id;

    // Update the 'current' flag for all other governments.
    await Government.updateMany({
        current: true
    }, {
        current: false
    });

    // Update the current flag for this government
    await Government.updateOne({
        _id: governmentID
    }, {
        current: true
    });

    return true;
}