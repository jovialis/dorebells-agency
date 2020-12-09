/**
 * Created on 12/7/20 by jovialis (Dylan Hanson)
 **/

const error = require('http-errors');

const {UserInputError} = require('apollo-server');

class PetitionAPI {

    /**
     * Construct and store instances of the controllers we'll need.
     */
    constructor() {
        this.controller = require('../controllers/petitions');
    }

    /**
     * This is a function that gets called by ApolloServer when being setup.
     * This function gets called with the datasource config including things
     * like caches and context.
     */
    initialize(config) {
        this.context = config.context;
    }

    /**
     * Returns the creator of a Petition
     * @param petitionUID
     * @returns {Promise<User>}
     */
    async getCreator(petitionUID) {
        return await this.getPopulatedFieldInPetition(petitionUID, 'creator');
    }

    /**
     * Returns the Government of a Petition's filing
     * @param petitionUID
     * @returns {Promise<Government>}
     */
    async getGovernment(petitionUID) {
        return await this.getPopulatedFieldInPetition(petitionUID, 'government');
    }

    /**
     * Returns the Target of a Petition
     * @param petitionUID
     * @returns {Promise<Target>}
     */
    async getTarget(petitionUID) {
        return await this.getPopulatedFieldInPetition(petitionUID, 'target');
    }

    /**
     * Returns the Tags of a Petition
     * @param petitionUID
     * @returns {Promise<[Tag]>}
     */
    async getTags(petitionUID) {
        return await this.getPopulatedFieldInPetition(petitionUID, 'tags');
    }

    async getSignatures(petitionUID) {
        return await this.controller.getPetitionSignaturesByUID(petitionUID);
    }

    /**
     * Returns the Government of a Tag
     * @param tagUID
     * @returns {Promise<Government>}
     */
    async getTagGovernment(tagUID) {
        return await this.getPopulatedFieldInTag(tagUID, 'government');
    }

    async getPetitionsByTag(tagUID) {
        return await this.controller.getPetitionsByTagUID(tagUID);
    }

    /**
     * Lists all Petitions for a given Government.
     * @param governmentUID
     * @returns {Promise<[Petition]>}
     */
    async listPetitions(governmentUID) {
        return await this.controller.getPetitionsByGovernmentUID(governmentUID);
    }

    /**
     * Returns a list of Targets by Government
     * @param governmentUID
     * @returns {Promise<[Target]>}
     */
    async getGovernmentTargets(governmentUID) {
        return await this.controller.listGovernmentTargets(governmentUID);
    }

    /**
     * Returns a list of Tags by Government
     * @param governmentUID
     * @returns {Promise<[Tag]>}
     */
    async getGovernmentTags(governmentUID) {
        return await this.controller.listGovernmentTags(governmentUID);
    }

    /**
     * Returns the Creator of a Tag
     * @param tagUID
     * @returns {Promise<User>}
     */
    async getTagCreator(tagUID) {
        return await this.getPopulatedFieldInTag(tagUID, 'creator');
    }

    /**
     * Returns the holding Government of a Target
     * @param targetUID
     * @returns {Promise<Government>}
     */
    async getTargetGovernment(targetUID) {
        return await this.getPopulatedFieldInTarget(targetUID, 'government');
    }

    async getPetitionsByTarget(targetUID) {
        return await this.controller.getPetitionsByTargetUID(targetUID);
    }

    /**
     * Returns the Creator of a Target
     * @param targetUID
     * @returns {Promise<User>}
     */
    async getTargetCreator(targetUID) {
        return await this.getPopulatedFieldInTarget(targetUID, 'creator');
    }

    /**
     * Returns the Petition of a given Signature
     * @param signatureUID Signature UID
     * @returns {Promise<Petition>}
     */
    async getSignaturePetition(signatureUID) {
        return await this.getPopulatedFieldInSignature(signatureUID, 'petition');
    }

    /**
     * Returns the Signing User of a given Signature
     * @param signatureUID
     * @returns {Promise<User>}
     */
    async getSignatureUser(signatureUID) {
        return await this.getPopulatedFieldInSignature(signatureUID, 'user');
    }

    /**
     * Returns the referring user of a given Signature
     * @param signatureUID
     * @returns {Promise<User>}
     */
    async getSignatureReferrer(signatureUID) {
        return await this.getPopulatedFieldInSignature(signatureUID, 'referrer');
    }

    /**
     * Returns the number of users who have been referred through this signature.
     * @param signatureUID
     * @returns {Promise<Number>}
     */
    async getSignatureReferralCount(signatureUID) {
        return await this.controller.getSignatureReferralCountByUID(signatureUID);
    }

    /**
     * Returns the number of users who have signed this petition.
     * @param petitionUID
     * @returns {Promise<Number>}
     */
    async getPetitionSignatureCount(petitionUID) {
        return await this.controller.getPetitionSignatureCountByUID(petitionUID);
    }

    /**
     * Utility method to populate and return a field in a given Petition
     * @param uid
     * @param fieldName
     * @returns {Promise<*>}
     */
    async getPopulatedFieldInPetition(uid, fieldName) {
        const petition = await this.controller.getPetitionByUID(uid, {
            select: fieldName,
            populate: fieldName
        });
        return petition[fieldName];
    }

    /**
     * Utility method to populate and return a field in a given Tag
     * @param uid
     * @param fieldName
     * @returns {Promise<*>}
     */
    async getPopulatedFieldInTag(uid, fieldName) {
        const tag = await this.controller.getTagByUID(uid, {
            select: fieldName,
            populate: fieldName
        });
        return tag[fieldName];
    }

    /**
     * Utility method to populate and return a field in a given Target
     * @param uid
     * @param fieldName
     * @returns {Promise<*>}
     */
    async getPopulatedFieldInTarget(uid, fieldName) {
        const target = await this.controller.getTargetByUID(uid, {
            select: fieldName,
            populate: fieldName
        });
        return target[fieldName];
    }

    /**
     * Utility method to populate and return a field in a given Target
     * @param uid
     * @param fieldName
     * @returns {Promise<*>}
     */
    async getPopulatedFieldInSignature(uid, fieldName) {
        const target = await this.controller.getSignatureByUID(uid, {
            select: fieldName,
            populate: fieldName
        });
        return target[fieldName];
    }

    /**
     * Creates a new tag for the given Government
     * @param user
     * @param government
     * @param input
     * @returns {Promise<Tag>}
     */
    async createTag(user, government, input) {
        return await this.controller.createTag(user, government, input);
    }

    /**
     * Creates a new tag for the given Government
     * @param user
     * @param government
     * @param input
     * @returns {Promise<Tag>}
     */
    async createTarget(user, government, input) {
        return await this.controller.createTarget(user, government, input);
    }

    /**
     * Creates a new Petition for the current Government.
     * @param user
     * @param input
     * @returns {Promise<Petition>}
     */
    async createPetition(user, input) {
        // Preflight validation
        if (!input.target) {
            throw new UserInputError('You must provide a petition Target!');
        }

        if (!input.tags) {
            input.tags = [];
        }

        return await this.controller.createPetition(user, input);
    }

}

module.exports = PetitionAPI;