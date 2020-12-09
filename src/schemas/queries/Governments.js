/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    # Allows a logged in user to fetch a petition by its ID.
    listGovernments: [Government]
    
    # Fetches a given government. Returns the current government if UID is not specified.
    getGovernment(uid: ID): Government!
`;

const resolvers = {
    async listGovernments(parent, _args, {user, dataSources: {governmentAPI}}) {
        return await governmentAPI.listGovernments();
    },
    async getGovernment(parent, {uid}, {user, dataSources: {governmentAPI}}) {
        return await governmentAPI.getGovernment(uid);
    },
};

module.exports = new MethodSchemaPackage(signatures, resolvers);