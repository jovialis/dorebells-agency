/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const Government = mongoose.model('Government');

const createError = require('http-errors');

const {optionsQuery, DefaultQueryOptions} = require('../utils/queryOptionsWrapper');

module.exports = {
    getGovernmentByUID,
    getPetitionsByGovernmentUID,
    getMembersByGovernmentUID
};

/**
 *
 * @param uid Governments UID to fetch
 * @param options Specifications to the query.
 *        - lean: Leanify the query (return as JSON)
 *        - select (Array or String): Fields to select from
 *        - populate (Array or String): Fields to populate
 *        None specified returns a default {mongoose.Document}
 * @returns {Promise<Document>}
 */
async function getGovernmentByUID(uid, options = DefaultQueryOptions) {
    const gov = await optionsQuery(Government.findOne({uid}), options);
    if (!gov) {
        throw createError(404, "Government could not be found by that UID.");
    }

    return gov;
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