/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {DataSource} = require('apollo-server');
const error = require('http-errors');

class GovernmentAPI extends DataSource {

    /**
     * Construct and store instances of the controllers we'll need.
     */
    constructor() {
        super();
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

}

module.exports = GovernmentAPI;