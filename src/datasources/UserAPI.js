/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const {DataSource} = require('apollo-datasource');

const User = mongoose.model('User');
const RoleHolder = mongoose.model('RoleHolder');

const lookup = require('../helpers/lookup');
const logic = require('../utils/logic');

class UserAPI extends DataSource {

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
     * Returns a user by their UID.
     * @param userUID
     * @returns {Promise<User>}
     */
    async getUser(userUID) {
        return logic.demand(
            await lookup.getUserByUID(userUID),
            "Invalid User UID."
        );
    }

    /**
     * Returns a user by their UID.
     * @returns {Promise<User>}
     * @param userObjectId
     */
    async getUserByObjectID(userObjectId) {
        return logic.demand(
            await User.findById(userObjectId).lean(),
            "Invalid User UID."
        );
    }

    async getMe() {
        if (!this.context.user) {
            return null;
        } else {
            return await this.getUser(this.context.user.uid);
        }
    }

    /**
     * Returns a list of Roles for a given user and a given Government.
     * @param userUID
     * @param governmentUID
     * @param options
     * @returns {Promise<[Role]>}
     */
    async getUserRoles(userUID, governmentUID) {
        const user = logic.demand(
            await lookup.getUserObjectByUID(userUID),
            "Invalid User UID."
        );

        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        const roleHoldings = await RoleHolder
            .find({ government, user })
            .select('role')
            .populate('role')
            .lean();

        return roleHoldings.map(r => r.role);
    }

    /**
     * Returns a flat list of all the user's permissions.
     * @param userUID User UID
     * @param governmentUID Optional Government UID.
     * @returns {Promise<[String]>}
     */
    async getUserPermissions(userUID, governmentUID) {
        const user = logic.demand(
            await lookup.getUserObjectByUID(userUID),
            "Invalid User UID."
        );

        const government = logic.demand(
            await lookup.getGovernmentObjectByUID(governmentUID),
            "Invalid Government UID."
        );

        const roleHoldings = await RoleHolder
            .find({ government, user })
            .select('role')
            .populate({path: 'role', select: 'permissions'})
            .lean();

        return roleHoldings.reduce((r, v) => {
            r.push(...v.permissions);
            return r;
        }, []);
    }

}

module.exports = UserAPI;