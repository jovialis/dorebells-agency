/**
 * Created on 12/25/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');

const {fastQuery, FastQueryOptions} = require('../utils/fastQuery');

module.exports = {
    getPetitionByUID,
    getTagByUID,
    getTargetByUID,
    getSignatureByUID,
    getGovernmentByUID,

    getPopulatedFieldInPetitionByUID,
    getPopulatedFieldInSignatureByUID,
    getPopulatedFieldInTagByUID,
    getPopulatedFieldInTargetByUID,

    findReferencingSignatures,
    findReferencingPetitions
};

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
    return await getDocumentByUID('Government', uid, options);
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
    return await getPopulatedFieldInDocumentByUID('Target', uid, fieldName);
}

async function getPopulatedFieldInDocumentByUID(modelName, uid, fieldName) {
    if (typeof fieldName !== 'string') {
        throw new Error('Please use a String for the field name to populate.');
    }

    const doc = await getDocumentByUID(modelName, uid, {
        select: fieldName,
        populate: fieldName
    });
    return doc[fieldName];
}

async function findReferencingSignatures(fieldName, document, options = FastQueryOptions) {
    return await findReferencingDocuments('Signature', fieldName, document, options);
}

async function findReferencingPetitions(fieldName, document, options = FastQueryOptions) {
    return await findReferencingDocuments('Petition', fieldName, document, options);
}

async function findReferencingDocuments(modelName, fieldName, document, options) {
    let query = {};
    query[fieldName] = document;

    const Model = mongoose.model(modelName);
    return await fastQuery(Model.find(query), options);
}