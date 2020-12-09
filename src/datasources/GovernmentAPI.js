/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const error = require('http-errors');

class GovernmentAPI {

    /**
     * Construct and store instances of the controllers we'll need.
     */
    constructor() {
        this.controller = require('../controllers/governments');
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
     * Lists all available Governments
     * @returns {Promise<Government[]>}
     */
    async listGovernments() {
        return await this.controller.listGovernments();
    }

    /**
     * Gets a given Government by UID.
     * @param governmentUID
     * @returns {Promise<Government>}
     */
    async getGovernment(governmentUID) {
        return await this.controller.getGovernmentByUID(governmentUID);
    }

    /**
     * Returns the creator of the government known by the provided UID.
     */
    async getCreator(governmentUID) {
        const {creator} = await this.controller.getGovernmentByUID(governmentUID, {
            select: "creator",
            populate: "creator"
        });
        return creator;
    }

    /**
     * Returns the date that a Government was created on.
     * @param governmentUID
     * @returns {Promise<Date>}
     */
    async getCreationDate(governmentUID) {
        const {timestamp} = await this.controller.getGovernmentByUID(governmentUID, {
            select: "timestamp"
        });
        return timestamp;
    }

    /**
     * Returns the petitions associated with this government.
     */
    async getPetitions(governmentUID) {
        return await this.controller.getPetitionsByGovernmentUID(governmentUID);
    }

    /**
     * Returns the users with officer+ roles in this government.
     */
    async getMembers(governmentUID) {
        return await this.controller.getMembersByGovernmentUID(governmentUID);
    }

    /**
     * Creates a new government with a given Request and a given User.
     * @param user
     * @param request
     * @returns {Promise<Government>}
     */
    async createGovernment(user, request) {
        return await this.controller.createGovernment(user, request);
    }

    /**
     * Sets a given Government as the current one.
     * @param user
     * @param uid
     * @returns {Promise<boolean>}
     */
    async setCurrentGovernment(user, uid) {
        return await this.controller.setCurrentGovernment(user, uid);
    }

}

module.exports = GovernmentAPI;