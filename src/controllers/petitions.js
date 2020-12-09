/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const createError = require('http-errors');
const mongoose = require('mongoose');

const Petition = mongoose.model('Petition');
const Tag = mongoose.model('Tag');
const Target = mongoose.model('Target');
const Signature = mongoose.model('Petition');

const {optionsQuery, DefaultQueryOptions} = require('../utils/queryOptionsWrapper');

module.exports = {
    getPetitionsByGovernmentUID,
    getPetitionsByGovernment,
    getPetitionSignaturesByUID,

    getSignatureReferralCountByUID,
    getPetitionSignatureCountByUID,

    getPetitionByUID,
    getTagByUID,
    getTargetByUID,
    getSignatureByUID,

    getPetitionsByTagUID,
    getPetitionsByTargetUID,

    listGovernmentTags,
    listGovernmentTargets,

    createPetition,

    createTag,
    createTarget
};

/**
 * Fetches a Petition by its UID
 * @param uid Petition UID
 * @param options
 * @returns {Promise<Petition>}
 */
async function getPetitionByUID(uid, options = DefaultQueryOptions) {
    const petition = await optionsQuery(Petition.findOne({uid}), options);
    if (!petition) {
        throw createError(404, 'No Petition found by that UID.');
    }

    return petition;
}

/**
 * Returns a list of all Targets available for a given Government
 * @param governmentUID
 * @param options
 * @returns {Promise<void>}
 */
async function listGovernmentTargets(governmentUID, options = DefaultQueryOptions) {
    const governments = require('./governments');
    const {_id: governmentID} = await governments.getGovernmentByUID(governmentUID, {
        select: '_id'
    });

    return await optionsQuery(Target.find({government: governmentID}), options);
}

/**
 * Returns a list of all Tags available for a given Government
 * @param governmentUID
 * @param options
 * @returns {Promise<void>}
 */
async function listGovernmentTags(governmentUID, options = DefaultQueryOptions) {
    const governments = require('./governments');
    const {_id: governmentID} = await governments.getGovernmentByUID(governmentUID, {
        select: '_id'
    });

    return await optionsQuery(Tag.find({government: governmentID}), options);
}

/**
 * Fetches a Tag by its UID
 * @param uid Tag UID
 * @param options
 * @returns {Promise<Tag>}
 */
async function getTagByUID(uid, options = DefaultQueryOptions) {
    const tag = await optionsQuery(Tag.findOne({uid}), options);
    if (!tag) {
        throw createError(404, 'No Tag found by that UID.');
    }

    return tag;
}

/**
 * Fetches a Target by its UID
 * @param uid Target UID
 * @param options
 * @returns {Promise<Target>}
 */
async function getTargetByUID(uid, options = DefaultQueryOptions) {
    const target = await optionsQuery(Target.findOne({uid}), options);
    if (!target) {
        throw createError(404, 'No Target found by that UID.');
    }

    return target;
}

/**
 * Fetches a Signature by its UID
 * @param uid Signature UID
 * @param options
 * @returns {Promise<Signature>}
 */
async function getSignatureByUID(uid, options = DefaultQueryOptions) {
    const target = await optionsQuery(Signature.findOne({uid}), options);
    if (!target) {
        throw createError(404, 'No Signature found by that UID.');
    }

    return target;
}

/**
 * Returns petitions for a given government.
 * @param government Mongoose Document or Document ID for a Government document.
 * @param options Query options.
 * @returns {Promise<[Document]>}
 */
async function getPetitionsByGovernment(government, options = DefaultQueryOptions) {
    return await optionsQuery(Petition.find({government}), options);
}

/**
 * Returns petitions for a given government by its UID.
 * @param uid Government UID.
 * @param options Query options.
 * @returns {Promise<[Document]>}
 */
async function getPetitionsByGovernmentUID(uid, options = DefaultQueryOptions) {
    const governments = require('./governments');
    const {_id: governmentID} = await governments.getGovernmentByUID(uid, {
        select: '_id'
    });

    return await getPetitionsByGovernment(governmentID);
}


/**
 * Returns petitions for a given target by its UID.
 * @param uid Target UID.
 * @param options Query options.
 * @returns {Promise<[Petition]>}
 */
async function getPetitionsByTargetUID(uid, options = DefaultQueryOptions) {
    // Grab the target
    const {_id: targetID} = await getTargetByUID(uid, {
        select: '_id'
    })

    return await optionsQuery(Petition.find({ target: targetID }), options);
}

/**
 * Returns petitions for a given tag by its UID.
 * @param uid Target UID.
 * @param options Query options.
 * @returns {Promise<[Document]>}
 */
async function getPetitionsByTagUID(uid, options = DefaultQueryOptions) {
    // Grab the target
    const {_id: tagID} = await getTagByUID(uid, {
        select: '_id'
    })

    return await optionsQuery(Petition.find({ tag: tagID }), options);
}

/**
 * Returns a list of Signatures by the Petition's UID
 * @param uid
 * @param options
 * @returns {Promise<[Signature]>}
 */
async function getPetitionSignaturesByUID(uid, options = DefaultQueryOptions) {
    const petition = await getPetitionByUID(uid, {
        select: '_id'
    });

    const petitionId = petition._id;
    return await optionsQuery(Signature.find({petition: petitionId}), options);
}

/**
 * Returns the number of Signatures for a given petition
 * @param uid Petition UID
 * @returns {Promise<Number>}
 */
async function getPetitionSignatureCountByUID(uid) {
    const petition = await getPetitionByUID(uid, {
        select: '_id'
    });

    return Signature.countDocuments({ petition: petition });
}

/**
 * Returns the number of referrals for a given Signature.
 * @param uid Signature UID
 * @returns {Promise<Number>}
 */
async function getSignatureReferralCountByUID(uid) {
    const signature = await getSignatureByUID(uid, {
        select: ['_id', 'petition']
    });

    return Signature.countDocuments({
        referrer: signature,
        petition: signature.petition
    });
}

async function createTarget(user, governmentUID, {name}) {
    // Fetch the Government
    const governments = require('./governments');
    const {_id: governmentID} = await governments.getGovernmentByUID(governmentUID, {
        select: '_id'
    });

    // Create and return a new target
    return await Target.create({
        creator: user,
        government: governmentID,
        name
    });
}

async function createTag(user, governmentUID, {name}) {
    // Fetch the Tag
    const governments = require('./governments');
    const {_id: governmentID} = await governments.getGovernmentByUID(governmentUID, {
        select: '_id'
    });

    // Create and return a new target
    return await Tag.create({
        creator: user,
        government: governmentID,
        name
    });
}

/**
 * Creates a new Petition by the provided User and Input.
 * @param user
 * @param name
 * @param description
 * @param targetUID
 * @param tagUIDs
 * @returns {Promise<Petition>}
 */
async function createPetition(user, {name, description, target: targetUID, tags: tagUIDs}) {
    // Fetch the current government
    const governments = require('./governments');
    const {_id: governmentID} = await governments.getCurrentGovernment({
        select: '_id'
    });

    // Make sure Tag UIDs are unique
    tagUIDs = tagUIDs.reduce((list, tag) => {
        if (!list.includes(tag)) {
            list.push(tag);
        }
        return list;
    }, []);

    // Fetch the Tags by their UIDs, returning a list of UIDs.
    const tags = await optionsQuery(Tag.find({uid: { $in: tagUIDs }}), {
        select: '_id'
    });

    // Fetch the Target by its UID
    const target = await optionsQuery(Target.findOne({ uid: targetUID }), {
        select: '_id'
    });

    if (tags.length !== tagUIDs.length || !target) {
        throw createError(400, "Invalid categorization UIDs provided.");
    }

    // Create the new Petition.
    return await Petition.create({
        creator: user,
        target: target._id,
        government: governmentID,
        name,
        description,
        tags: tags.map(t => t._id)
    });
}