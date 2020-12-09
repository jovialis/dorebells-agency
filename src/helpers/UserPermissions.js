/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

module.exports = class UserPermissions {
    constructor(_id, uid) {
        this._id = _id;
        this.uid = uid;
        this._loaded = false;
    }

    /**
     * Loads a user's permissions into class' memory.
     * @returns {Promise<void>}
     */
    async load() {
        if (this._loaded) {
            return;
        }

        this._loaded = true;

        // TODO: Load permissions into list.
    }

    hasPermission(permissionName) {
        // TODO: Return true/false depending on whether User has authority.
    }
}