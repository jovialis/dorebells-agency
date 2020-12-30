/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const error = require('http-errors');
const mongoose = require('mongoose');
const {UserInputError} = require('apollo-server');
const {DataSource} = require('apollo-datasource')

const Government = mongoose.model('Government');
const Target = mongoose.model('Target');
const Tag = mongoose.model('Tag');
const Petition = mongoose.model('Petition');
const Role = mongoose.model('Role');
const RoleHolder = mongoose.model('RoleHolder');

const logic = require('../utils/logic');
const lookup = require('../helpers/lookup');

class GovernmentAPI extends DataSource {

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

    /**
     * Gets a given Government by UID.
     * @param governmentUID
     * @returns {Promise<Government>}
     */
    async getGovernment(governmentUID) {
        return logic.demand(
            await lookup.getGovernmentByUID(governmentUID),
            "Invalid Government UID."
        );
    }

    /**
     * Gets the UID of the current government.
     * @returns {Promise<String>}
     */
    async getCurrentGovernmentUID() {
        return this.getGovernment(null);
    }

    /**
     * Lists all available Governments
     * @returns {Promise<Government[]>}
     */
    async getGovernments() {
        return Government.find({});
    }

    /**
     * Returns a list of Targets by Government
     * @param governmentUID
     * @returns {Promise<Target[]>}
     */
    async getGovernmentTargets(governmentUID) {
        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        return Target.find({ government });
    }

    /**
     * Returns a list of Tags by Government
     * @param governmentUID
     * @returns {Promise<Tag[]>}
     */
    async getGovernmentTags(governmentUID) {
        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        return Tag.find({ government });
    }

    /**
     * Lists all Petitions for a given Government.
     * @param governmentUID
     * @returns {Promise<Petition[]>}
     */
    async getGovernmentPetitions(governmentUID) {
        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        return Petition.find({ government });
    }

    /**
     * Returns the creator of the government known by the provided UID.
     */
    async getGovernmentCreator(governmentUID) {
        return await lookup.getPopulatedFieldInGovernmentByUID(governmentUID, 'creator');
    }

    /**
     * Returns the users with officer+ roles in this government.
     */
    async getGovernmentMembers(governmentUID) {
        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        const roleHoldings = await RoleHolder
            .find({government})
            .select('user')
            .populate('user');

        return roleHoldings.map(r => r.user);
    }

    /**
     * Returns a list of Roles in a given Government
     * @param governmentUID
     * @returns {Promise<[Role]>}
     */
    async getGovernmentRoles(governmentUID) {
        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        return Role.find({government});
    }

    /**
     * Creates a new government with a given Request and a given User.
     * @param user
     * @param request
     * @returns {Promise<Government>}
     */
    async createGovernment({name}) {
        // Require user or authenticate
        const user = logic.demandUser(this.context.user);

        // Make sure there isn't another government with the same name
        if (await Government.countDocuments({name}) > 0) {
            throw new UserInputError('Government by that name already exists.');
        }

        return await Government.create({
            name,
            creator: user
        });
    }

    /**
     * Sets a given Government as the current one.
     * @returns {Promise<Government>}
     * @param governmentUID
     */
    async setCurrentGovernment(governmentUID) {
        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        // Update the 'current' flag for all other governments.
        await Government.updateMany({
            current: true
        }, {
            current: false
        });

        // Update the current flag for this government
        await Government.updateOne({
            _id: government._id
        }, {
            current: true
        });

        return Government.findById(government._id).lean();
    }

    /**
     * Returns the Government for a given role
     * @param roleUID UID of the role.
     * @returns {Promise<Government>}
     */
    async getRoleGovernment(roleUID) {
        return await lookup.getPopulatedFieldInRoleByUID(roleUID, 'government');
    }

    async getGovernmentRoles(governmentUID) {
        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        return await lookup.findReferencingRoles('government', government);
    }

    async createGovernmentRole(governmentUID, {name}) {
        const user = logic.demandUser(this.context.user);

        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        return await Role.create({
            creator: user,
            government,
            name
        });
    }

}

module.exports = GovernmentAPI;