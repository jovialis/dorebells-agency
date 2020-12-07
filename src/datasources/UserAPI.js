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
     * @param options
     * @returns {Promise<[Role]>}
     */
    async getRoles(userUID, governmentUID) {
        return this.controller.getUserRolesByUIDAndGovernmentUID(userUID, governmentUID);
    }

    /**
     * Returns a flat list of all the user's permissions.
     * @param userUID User UID
     * @param governmentUID Optional Government UID.
     * @returns {Promise<[String]>}
     */
    async getPermissions(userUID, governmentUID) {
        const roles = await this.controller.getUserRolesByUIDAndGovernmentUID(userUID, governmentUID, {
            select: 'permissions'
        });
        return roles.reduce((r, v) => {
            r.push(...v.permissions);
            return r;
        }, []);
    }

    /**
     * Returns the Authenticator type used by the user.
     * @param userUID UID of the user.
     * @returns {Promise<String>}
     */
    async getAuthenticator(userUID) {
        const user = await this.controller.getUserByUID(userUID, {
            select: 'authenticator',
            populate: [{
                path: 'authenticator',
                select: 'authenticatorType'
            }]
        });
        return user.authenticator.authenticatorType;
    }

    /**
     * Returns the Government for a given role
     * @param roleUID UID of the role.
     * @returns {Promise<Government>}
     */
    async getRoleGovernment(roleUID) {
        const role = await this.controller.getRoleByUID(roleUID, {
            select: 'government',
            populate: 'government'
        });
        return role.government;
    }

}

module.exports = UserAPI;