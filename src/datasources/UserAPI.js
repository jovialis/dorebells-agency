/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {DataSource} = require('apollo-server');
const error = require('http-errors');

class UserAPI extends DataSource {

    /**
     * Construct and store instances of the controllers we'll need.
     */
    constructor() {
        super();
        this.controller = require('../controllers/users');
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
     * Returns a user by their UID.
     * @param userUID
     * @returns {Promise<User>}
     */
    async getUser(userUID) {
        return this.controller.getUserByUID(userUID);
    }

    /**
     * Returns a list of Roles for a given user and a given Government.
     * @param userUID
     * @param governmentUID
     * @returns {Promise<[Role]>}
     */
    async getRoles(userUID, governmentUID) {
        return this.controller.getUserRolesByUIDAndGovernmentUID(userUID, governmentUID);
    }

}

module.exports = GovernmentAPI;