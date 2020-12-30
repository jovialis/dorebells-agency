/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    # Allows a logged in user to fetch a petition by its ID.
    governments: [Government]
    
    # Fetches a given government. Returns the current government if UID is not specified.
    government(id: ID): Government!
`;

const resolvers = {
    async governments(parent, _args, {dataSources}) {
        return await dataSources.governmentAPI.getGovernments();
    },
    async government(parent, {id}, {dataSources}) {
        return await dataSources.governmentAPI.getGovernment(id);
    },
};

module.exports = new MethodSchemaPackage(signatures, resolvers);