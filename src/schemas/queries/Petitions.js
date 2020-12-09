/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    # Lists petitions
    listPetitions(government: ID): [Petition]!

    # Allows a logged in user to fetch a petition by its ID.
    getPetition(id: ID!): Petition
    
    # Lists all targets available for a given Government.
    # Returns Targets available for current government if UID not specified.
    listTargets(government: ID): [Target]!
    
    # Lists all tags available for a given Government
    # Returns Tags available for current government if UID not specified
    listTags(government: ID): [Tag]!
`;

const resolvers = {
    getPetition(parent, {id}, context) {
        return null;
    },
    async listPetitions(parent, {government}, {user, dataSources: {petitionAPI}}) {
        return await petitionAPI.listPetitions(government);
    },
    async listTargets(parent, {government}, {user, dataSources: {petitionAPI}}) {
        return await petitionAPI.getGovernmentTargets(government);
    },
    async listTags(parent, {government}, {user, dataSources: {petitionAPI}}) {
        return await petitionAPI.getGovernmentTags(government);
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers);