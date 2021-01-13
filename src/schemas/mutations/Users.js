/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

const permissions = require('../../permissions');
const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const {AuthenticationError} = require('apollo-server');

const signatures = `
    # Creates a new role
    createRole(government: ID!, input: CreateRoleRequest!): Role!
`;

const objects = `
    input CreateRoleRequest {
        name: String!
        color: String!
    }
`;

const resolvers = {
    async createRole(parent, {government, input}, {dataSources}) {
        return await dataSources.governmentAPI.createGovernmentRole(government, input);
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers, objects);