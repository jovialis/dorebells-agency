/**
 * Created on 12/7/20 by jovialis (Dylan Hanson)
 **/

const error = require('http-errors');
const mongoose = require('mongoose');
const {UserInputError} = require('apollo-server');
const {DataSource} = require('apollo-datasource')

const Signature = mongoose.model('Signature');
const Petition = mongoose.model('Petition');
const Tag = mongoose.model('Tag');
const Target = mongoose.model('Target');

const petitions = require('../helpers/petitions');

const lookup = require('../helpers/lookup');
const logic = require('../utils/logic');

class PetitionAPI extends DataSource {

    /**
     * Construct and store instances of the controllers we'll need.
     */
    constructor() {
        super();
    }

    /**
     * This is a function that gets called by ApolloServer when being setup.
     * This function gets called with the datasource config including things
     * like caches and context.
     */
    initialize(config) {
        this.context = config.context;
    }

    async getTrendingPetitions() {
        return petitions.getTrendingPetitions();
    }

    async getPetition(petitionUID) {
        return logic.demand(
            await lookup.getPetitionByUID(petitionUID),
            "Invalid Petition UID."
        );
    }

    /**
     * Returns the creator of a Petition
     * @param petitionUID
     * @returns {Promise<User>}
     */
    async getPetitionCreator(petitionUID) {
        return await lookup.getPopulatedFieldInPetitionByUID(petitionUID, 'creator');
    }

    /**
     * Returns the Government of a Petition's filing
     * @param petitionUID
     * @returns {Promise<Government>}
     */
    async getPetitionGovernment(petitionUID) {
        return await lookup.getPopulatedFieldInPetitionByUID(petitionUID, 'government');
    }

    /**
     * Returns the Target of a Petition
     * @param petitionUID
     * @returns {Promise<Target>}
     */
    async getPetitionTarget(petitionUID) {
        return await lookup.getPopulatedFieldInPetitionByUID(petitionUID, 'target');
    }

    /**
     * Returns the Tags of a Petition
     * @param petitionUID
     * @returns {Promise<[Tag]>}
     */
    async getPetitionTags(petitionUID) {
        return await lookup.getPopulatedFieldInPetitionByUID(petitionUID, 'tags');
    }

    async getPetitionSignatures(petitionUID) {
        const petition = await logic.demand(
            await lookup.getPetitionObjectByUID(petitionUID),
            "Invalid Petition UID."
        );

        return Signature.find({petition}).sort({createdOn: -1}).lean();

        // return await lookup.findReferencingSignatures('petition', petition);
    }

    async getPetitionComments(petitionUID) {
        const petition = await logic.demand(
            await lookup.getPetitionObjectByUID(petitionUID),
            "Invalid Petition UID."
        );

        let res = await Signature.find({
            petition,
            comment: {
                $exists: true,
                $ne: null
            }
        });

        // Sort signatures by number of likes
        res = res.sort((a, b) => b.likes.length - a.likes.length);
        return res;
    }

    async getPetitionCommentCount(petitionUID) {
        const petition = await logic.demand(
            await lookup.getPetitionObjectByUID(petitionUID),
            "Invalid Petition UID."
        );

        return Signature.countDocuments({
            petition,
            comment: {
                $exists: true,
                $ne: null
            }
        });
    }

    /**
     * Returns the Government of a Tag
     * @param tagUID
     * @returns {Promise<Government>}
     */
    async getTagGovernment(tagUID) {
        return await lookup.getPopulatedFieldInTagByUID(tagUID, 'government');
    }

    async getPetitionsByTag(tagUID) {
        const tag = await logic.demand(
            await lookup.getTagObjectByUID(tagUID),
            "Invalid Tag UID."
        );

        return await this.lookup.findReferencingPetitions('tag', tag);
    }

    async getPetitionsByGovernment(governmentUID) {
        const government = await logic.demand(
            await lookup.getTagObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        return await petitions.getTopPetitions(government);
    }

    async getPetitionsByTarget(targetUID) {
        const target = await logic.demand(
            await lookup.getTargetObjectByUID(targetUID),
            "Invalid Target UID."
        );

        return await this.lookup.findReferencingPetitions('target', target);
    }

    /**
     * Returns the Creator of a Tag
     * @param tagUID
     * @returns {Promise<User>}
     */
    async getTagCreator(tagUID) {
        return await lookup.getPopulatedFieldInTagByUID(tagUID, 'creator');
    }

    /**
     * Returns the holding Government of a Target
     * @param targetUID
     * @returns {Promise<Government>}
     */
    async getTargetGovernment(targetUID) {
        return await lookup.getPopulatedFieldInTargetByUID(targetUID, 'government');
    }


    /**
     * Returns the Creator of a Target
     * @param targetUID
     * @returns {Promise<User>}
     */
    async getTargetCreator(targetUID) {
        return await lookup.getPopulatedFieldInTargetByUID(targetUID, 'creator');
    }

    /**
     * Returns the Petition of a given Signature
     * @param signatureUID Signature UID
     * @returns {Promise<Petition>}
     */
    async getSignaturePetition(signatureUID) {
        return await lookup.getPopulatedFieldInSignatureByUID(signatureUID, 'petition');
    }

    /**
     * Returns the Signing User of a given Signature
     * @param signatureUID
     * @returns {Promise<User>}
     */
    async getSignatureUser(signatureUID) {
        return await lookup.getPopulatedFieldInSignatureByUID(signatureUID, 'user');
    }

    /**
     * Returns the referring user of a given Signature
     * @param signatureUID
     * @returns {Promise<User>}
     */
    async getSignatureReferrer(signatureUID) {
        return await lookup.getPopulatedFieldInSignatureByUID(signatureUID, 'referrer');
    }

    /**
     * Returns the number of users who have been referred through this signature.
     * @param signatureUID
     * @returns {Promise<Number>}
     */
    async getSignatureReferralCount(signatureUID) {
        const referrer = await logic.demand(
            await lookup.getSignatureObjectByUID(signatureUID),
            "Invalid Signature UID."
        );

        return Signature.countDocuments({ referrer });
    }

    /**
     * Returns the number of users who have signed this petition.
     * @param petitionUID
     * @returns {Promise<Number>}
     */
    async getPetitionSignatureCount(petitionUID) {
        const petition = await logic.demand(
            await lookup.getPetitionObjectByUID(petitionUID),
            "Invalid Petition UID."
        );

        return Signature.countDocuments({ petition });
    }

    /**
     * Creates a new tag for the given Government
     * @param user
     * @param government
     * @param input
     * @returns {Promise<Document>}
     */
    async createTag(governmentUID, {name}) {
        const user = await logic.demandUser(this.context.user);

        const government = await logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        // Create and return a new target
        return await Tag.create({
            creator: user,
            government: government,
            name
        });
    }

    /**
     * Creates a new tag for the given Government
     * @param user
     * @param government
     * @param input
     * @returns {Promise<Document>}
     */
    async createTarget(governmentUID, {name}) {
        const user = await logic.demandUser(this.context.user);

        const government = await logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        // Create and return a new target
        return await Target.create({
            creator: user,
            government,
            name
        });
    }

    /**
     * Creates a new Petition for the current Government.
     * @param user
     * @param input
     * @returns {Promise<Document>}
     */
    async createPetition({target: targetUID, tags: tagUIDs, name, description}) {
        const user = await logic.demandUser(this.context.user);

        // Fetch the current government
        const government = await lookup.getGovernmentObjectByUID(null);

        // Make sure Tag UIDs are unique
        tagUIDs = tagUIDs.reduce((list, tag) => {
            if (!list.includes(tag)) {
                list.push(tag);
            }
            return list;
        }, []);

        // Fetch the Tags by their UIDs, returning a list of UIDs.
        const tags = await Tag.find({uid: {$in: tagUIDs}}).select('_id').lean();
        const target = logic.demand(await lookup.getTargetByUID(targetUID), "Invalid Target provided.");

        // Make sure target exists
        if (tags.length !== tagUIDs.length) {
            throw new UserInputError('Invalid Tags provided.');
        }

        // Create the new Petition.
        return await Petition.create({
            creator: user,
            target,
            government,
            name,
            description,
            tags
        });
    }

    /**
     * Attempts to sign a petition.
     * @param user
     * @param input
     * @returns {Promise<Document>}
     */
    async signPetition(petitionUID, {referer: referralCode, comment}) {
        const user = await logic.demandUser(this.context.user);

        // Make sure the user hasn't signed
        if (await this.userHasSigned(petitionUID)) {
            throw new UserInputError("User has already signed that petition.");
        }

        // Ensure that's a valid Petition
        const petition = logic.demand(
            await lookup.getPetitionObjectByUID(petitionUID),
            "Invalid Petition provided."
        );

        // Attempt to discover who referred them to sign.
        let referrer = null;
        if (referralCode) {
            referrer = await Signature.findOne({referralCode}).select('_id').lean();
        }

        // Create the Signature
        return await Signature.create({
            user,
            referrer,
            petition,
            comment
        });
    }

    async userHasSigned(petitionUID) {
        const user = this.context.user;
        if (!user) {
            return false;
        }

        const petition = logic.demand(
            await lookup.getPetitionObjectByUID(petitionUID),
            "Invalid Signature provided."
        );

        const count = await Signature.countDocuments({ petition, user });
        return count > 0;
    }

    async likeSignature(signatureUID) {
        const user = await logic.demandUser(this.context.user);

        if (await this.userHasLiked(signatureUID)) {
            throw new UserInputError("User has already liked that Comment!");
        }

        let signature = logic.demand(
            await Signature.findOne({uid: signatureUID}),
            "Invalid Signature provided."
        );

        signature.likes.push({
            user
        });

        await Signature.updateOne({
            _id: signature._id
        }, {
            likes: signature.likes
        });

        return signature;
    }

    async userHasLiked(signatureUID) {
        const user = this.context.user;
        if (!user) {
            return false;
        }

        const signature = logic.demand(
            await lookup.getSignatureObjectByUID(signatureUID),
            "Invalid Signature provided."
        );

        const count = await Signature.countDocuments({
            _id: signature._id,
            likes: {
                $elemMatch: {
                    user
                }
            }
        });

        return count > 0;
    }

    async getPetitionSignatureTarget(petitionUID) {
        // determine how many signatures we have
        const signatureCount = await this.getPetitionSignatureCount(petitionUID);

        // static signature targets
        const targets = [
            10,
            20,
            50,
            100,
            200,
            500,
            1000,
            2000,
            5000,
            10000,
            20000,
            50000
        ];

        // find the first target that's greater than our signature count
        for (const target of targets) {
            if (target > signatureCount) {
                return target;
            }
        }

        return 100000;
    }

    async getPetitionIsMutable(petitionUID) {
        // Petition is only mutable if the Government is set to Current.
        const government = await lookup.getPopulatedFieldInPetitionByUID(petitionUID, 'government');
        return government.current;
    }

}

module.exports = PetitionAPI;