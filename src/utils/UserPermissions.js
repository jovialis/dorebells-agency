/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

/**
 * Encapsulated Class for determining whether or not a user has a given Permission.
 * Loads all Permissions from different Roles and provides support for Permissions across different governments.
 * @type {module.UserPermissions}
 */
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
    async load(userAPI, governmentAPI) {
        if (this._loaded) {
            return;
        }

        this._loaded = true;

        // Load data
        const currentGovernment = await governmentAPI.getCurrentGovernmentUID();
        const permissions = await userAPI.getAllPermissions(this.uid);

        // Save
        this.currentGovernment = currentGovernment;
        this.permissions = permissions;
    }

    hasPermission(requiredPermission, government = null) {
        if (!this._loaded) {
            throw new Error("Failed to load User Permissions before accessing.");
        }

        // If there's no government provided, default to the current government.
        if (!government) {
            if (!this.currentGovernment) {
                return false;
            }

            government = this.currentGovernment;
        }

        // Pull out permissions for a given Government.
        let allPermissions = this.permissions[government];
        if (!allPermissions) {
            return false;
        }

        // Search for a permission that satisfies the requirement
        for (const permission of allPermissions) {
            if (UserPermissions.__permissionIsAdequate(permission, requiredPermission)) {
                return true;
            }
        }

        return false;
    }

    static __permissionIsAdequate(userPermission, requiredPermission) {
        // We compare by getting each segment, separated by periods.
        const splitUserPermission = userPermission.split('.');
        const splitRequiredPermission = requiredPermission.split('.');

        // Go through indexes side by side.
        let i = 0;

        // Only go through until the end of the user, because if the user permission is shallower
        // than the required one, and they match up until the end, then the user is allowed to perform that action.
        while (i < splitUserPermission.length) {

            // If the user has a permission that's deeper than the one required, we know to return false.
            if (i >= splitRequiredPermission.length) {
                return false;
            }

            const curUserPermission = splitUserPermission[i];
            const curRequiredPermission = splitRequiredPermission[i];

            // If the user has a wildcard at this position, we know that they have permission.
            if (curUserPermission === '*') {
                return true;
            }

            // If the user's permission doesn't match, then they definitely don't have permission.
            if (curUserPermission.toUpperCase() !== curRequiredPermission.toUpperCase()) {
                return false;
            }

            i++;
        }

        return true;
    }
}