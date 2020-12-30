/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

/**
 * Represents a static map of ALL available Permissions in the DoreBells application.
 * These can be given to different Roles, and they correspond to the ability to get/set something
 * Within the application.
 * @type {Permissions}
 */
module.exports = {
    OP: '*',
    ADMIN: 'admin.*',
    ADMIN_GOVERNMENT: 'admin.government.*',
    ADMIN_GOVERNMENT_TARGETS: 'admin.government.targets',
    ADMIN_GOVERNMENT_TAGS: 'admin.government.tags',
};