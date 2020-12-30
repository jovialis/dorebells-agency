/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    trendingPetitions: [Petition]!

    # Lists petitions
    petitions(government: ID): [Petition]!

    # Allows a logged in user to fetch a petition by its ID.
    petition(id: ID!): Petition!
    
    # Lists all targets available for a given Government.
    # Returns Targets available for current government if UID not specified.
    targets(government: ID): [Target]!
    
    # Lists all tags available for a given Government
    # Returns Tags available for current government if UID not specified
    tags(government: ID): [Tag]!
`;

const resolvers = {
    async trendingPetitions(_parent, _args, {dataSources}) {
        return await dataSources.petitionAPI.getTrendingPetitions();
    },
    async petition(parent, {id}, {dataSources}) {
        return await dataSources.petitionAPI.getPetition(id);
    },
    async petitions(parent, {government}, {dataSources}) {
        return await dataSources.petitionAPI.getPetitionsByGovernment(government);
    },
    async targets(parent, {government}, {dataSources}) {
        return await dataSources.governmentAPI.getGovernmentTargets(government);
    },
    async tags(parent, {government}, {dataSources}) {
        return await dataSources.governmentAPI.getGovernmentTags(government);
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers);