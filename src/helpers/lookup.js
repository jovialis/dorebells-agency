/**
 * Created on 12/25/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');

const logic = require('../utils/logic');

const {fastQuery, FastQueryOptions} = require('../utils/fastQuery');

module.exports = {
    getPetitionObjectByUID,
    getTagObjectByUID,
    getTargetObjectByUID,
    getSignatureObjectByUID,
    getGovernmentObjectByUID,
    getUserObjectByUID,

    getPetitionByUID,
    getTagByUID,
    getTargetByUID,
    getSignatureByUID,
    getGovernmentByUID,
    getUserByUID,

    getPopulatedFieldInPetitionByUID,
    getPopulatedFieldInSignatureByUID,
    getPopulatedFieldInTagByUID,
    getPopulatedFieldInTargetByUID,
    getPopulatedFieldInGovernmentByUID,
    getPopulatedFieldInRoleByUID,

    findReferencingSignatures,
    findReferencingPetitions,
    findReferencingRoles
};

async function getPetitionObjectByUID(uid) {
    return await getDocumentByUID('Petition', uid, {
        select: '_id'
    });
}

async function getTagObjectByUID(uid) {
    return await getDocumentByUID('Tag', uid, {
        select: '_id'
    });
}

async function getTargetObjectByUID(uid) {
    return await getDocumentByUID('Target', uid, {
        select: '_id'
    });
}

async function getSignatureObjectByUID(uid) {
    return await getDocumentByUID('Signature', uid, {
        select: '_id'
    });
}

async function getGovernmentObjectByUID(uid) {
    return await getGovernmentByUID(uid, {
        select: '_id'
    });
}

async function getUserObjectByUID(uid) {
    return await getUserByUID(uid, {
        select: '_id'
    });
}

async function getPetitionByUID(uid, options = FastQueryOptions) {
    return await getDocumentByUID('Petition', uid, options);
}

async function getTagByUID(uid, options = FastQueryOptions) {
    return await getDocumentByUID('Tag', uid, options);
}

async function getTargetByUID(uid, options = FastQueryOptions) {
    return await getDocumentByUID('Target', uid, options);
}

async function getSignatureByUID(uid, options = FastQueryOptions) {
    return await getDocumentByUID('Signature', uid, options);
}

async function getGovernmentByUID(uid, options = FastQueryOptions) {
    let query = {};

    // if no UID provided, fetch the current Government.
    if (uid) {
        query.uid = uid;
    } else {
        query.current = true;
    }

    const Model = mongoose.model('Government');
    return await fastQuery(Model.findOne(query), options);
}

async function getUserByUID(uid, options = FastQueryOptions) {
    return await getDocumentByUID('User', uid, options);
}

async function getDocumentByUID(modelName, uid, options) {
    const Model = mongoose.model(modelName);
    return await fastQuery(Model.findOne({uid}), options);
}

async function getPopulatedFieldInPetitionByUID(uid, fieldName) {
    return await getPopulatedFieldInDocumentByUID('Petition', uid, fieldName);
}

async function getPopulatedFieldInTagByUID(uid, fieldName) {
    return await getPopulatedFieldInDocumentByUID('Tag', uid, fieldName);
}

async function getPopulatedFieldInTargetByUID(uid, fieldName) {
    return await getPopulatedFieldInDocumentByUID('Target', uid, fieldName);
}

async function getPopulatedFieldInSignatureByUID(uid, fieldName) {
    return await getPopulatedFieldInDocumentByUID('Signature', uid, fieldName);
}

async function getPopulatedFieldInGovernmentByUID(uid, fieldName) {
    return await getPopulatedFieldInDocumentByUID('Government', uid, fieldName);
}

async function getPopulatedFieldInRoleByUID(uid, fieldName) {
    return await getPopulatedFieldInDocumentByUID('Role', uid, fieldName);
}

async function getPopulatedFieldInDocumentByUID(modelName, uid, fieldName) {
    if (typeof fieldName !== 'string') {
        throw new Error('Please use a String for the field name to populate.');
    }

    const doc = logic.demand(await getDocumentByUID(modelName, uid, {
        select: fieldName,
        populate: fieldName
    }), 'Invalid document UID.');

    return doc[fieldName];
}

async function findReferencingSignatures(fieldName, document, options = FastQueryOptions) {
    return await findReferencingDocuments('Signature', fieldName, document, options);
}

async function findReferencingPetitions(fieldName, document, options = FastQueryOptions) {
    return await findReferencingDocuments('Petition', fieldName, document, options);
}

async function findReferencingRoles(fieldName, document, options = FastQueryOptions) {
    return await findReferencingDocuments('Role', fieldName, document, options);
}

async function findReferencingDocuments(modelName, fieldName, document, options) {
    let query = {};
    query[fieldName] = document;

    const Model = mongoose.model(modelName);
    return await fastQuery(Model.find(query), options);
}