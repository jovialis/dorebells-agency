/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const createError = require('http-errors');

const User = mongoose.model('User');
const Role = mongoose.model('Role');
const RoleHolder = mongoose.model('RoleHolder');

const {optionsQuery, DefaultQueryOptions, PopulateField} = require('../utils/queryOptionsWrapper');

module.exports = {
    getUserByUID,
    getUserRolesByUIDAndGovernmentUID,

    getRolesByGovernment,
    getRoleHoldingUsersByGovernment,

    getRoleByUID
};

/**
 * Returns a user fetched by their UID
 * @param uid User ID
 * @param options
 * @throws 404 if User not found
 * @returns {Promise<User>}
 */
async function getUserByUID(uid, options = DefaultQueryOptions) {
    const user = await optionsQuery(User.findOne({uid}), options);
    if (!user) {
        throw createError(404, "Government could not be found by that UID.");
    }

    return user;
}

/**
 * Returns a list of roles for a given user, fetched by the User UID and Government UID
 * @param userUID
 * @param governmentUID
 * @param options
 * @returns {Promise<Role[]>}
 */
async function getUserRolesByUIDAndGovernmentUID(userUID, governmentUID, options = DefaultQueryOptions) {
    // Fetch user
    const user = await getUserByUID(userUID, {
        select: '_id'
    });

    // Fetch government
    const governments = require('./governments');
    const gov = await governments.getGovernmentByUID(governmentUID, {
        select: '_id'
    });

    const userDocId = user._id;
    const govDocId = gov._id;

    return await getUserRolesByGovernment(userDocId, govDocId, options);
}

/**
 * Returns a list of roles that a government has available.
 * @param government Document or ObjectId
 * @param options
 * @returns {Promise<[Role]>}
 */
async function getRolesByGovernment(government, options = DefaultQueryOptions) {
    return await optionsQuery(Role.find({government}), options);
}

/**
 * Returns a list of roles that a given User possesses in a given government.
 * @param user Document or ObjectId
 * @param government Document or ObjectId
 * @param options
 * @returns {Promise<[Role]>}
 */
async function getUserRolesByGovernment(user, government, options = DefaultQueryOptions) {
    // Perform query, only fetching selected fields in the 'role' object.
    let toPopulate = (
        options.select.length > 0 ? (
            typeof (options.select === "string" ? [options.select] : options.select)
        ) : []
    ).map(s => PopulateField('role', s));

    // If there were no specifically requested fields to populate, we can just request the entire user object
    if (!toPopulate || toPopulate.length === 0) {
        toPopulate = ['role'];
    }

    const roleHoldings = await optionsQuery(RoleHolder.find({government, user}), {
        lean: options.lean,
        select: 'role',
        populate: toPopulate
    });

    // Pull out the populated roles.
    return roleHoldings.map(h => h.role);
}

/**
 * Returns a list of users who have roles in a given government
 * @param government Document or ObjectId
 * @param options
 * @returns {Promise<[User]>}
 */
async function getRoleHoldingUsersByGovernment(government, options = DefaultQueryOptions) {
    // Perform query, only fetching selected fields in the 'user' object.
    let toPopulate = (
        options.select.length > 0 ? (
            typeof (options.select === "string" ? [options.select] : options.select)
        ) : []
    ).map(s => PopulateField('user', s));

    // If there were no specifically requested fields to populate, we can just request the entire user object
    if (!toPopulate || toPopulate.length === 0) {
        toPopulate = ['user'];
    } else {
        // Make sure we always select the ID!
        toPopulate.push(PopulateField('user', '_id'));
    }

    const roleHoldings = await optionsQuery(RoleHolder.find({government}), {
        lean: options.lean,
        select: 'user',
        populate: toPopulate
    });

    // Pull out users and remove duplicates
    return roleHoldings.map(h => h.user).reduce((r, u) => {
        // Only put the user in the list if they aren't there already
        if (!r.find(x => x._id.equals(u._id))) {
            r.push(u);
        }
        return r;
    });
}

/**
 * Fetches a Role by its UID.
 * @param uid Role UID
 * @param options
 * @returns {Promise<Role>}
 */
async function getRoleByUID(uid, options = DefaultQueryOptions) {
    const role = await optionsQuery(Role.findOne({uid}), options);
    if (!role) {
        throw createError(404, "Role could not be found by that UID.");
    }

    return role;
}