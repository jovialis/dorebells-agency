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
    getPetitionsByGovernment,
    getPetitionSignaturesByUID,

    getSignatureReferralCountByUID,
    getPetitionSignatureCountByUID,

    getPetitionByUID,
    getTagByUID,
    getTargetByUID,
    getSignatureByUID
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
