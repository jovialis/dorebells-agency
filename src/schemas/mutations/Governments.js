/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

const permissions = require('../../permissions');
const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const {AuthenticationError} = require('apollo-server');

const signatures = `
    # Creates a new government
    createGovernment(input: CreateGovernmentRequest!): Government!
    
    # Sets a government as the current one
    setCurrentGovernment(government: ID!): Boolean!
`;

const objects = `
    input CreateGovernmentRequest {
        name: String!
    }
`;

const resolvers = {
    async createGovernment(parent, {input}, {dataSources}) {
        return await dataSources.governmentAPI.createGovernment(input);
    },
    async setCurrentGovernment(parent, {government}, {dataSources}) {
        return await dataSources.governmentAPI.setCurrentGovernment(government);
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers, objects);