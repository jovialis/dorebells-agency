/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const {AuthenticationError} = require('apollo-server');

const signatures = `
    # Creates a new government
    createGovernment(input: CreateGovernmentRequest!): Government!
    
    # Sets a government as the current one
    setCurrentGovernment(uid: ID!): Boolean!
    
    
`;

const objects = `
    input CreateGovernmentRequest {
        name: String!
    }
`;

const resolvers = {
    async createGovernment(parent, {input}, {user, dataSources: { governmentAPI }}) {
        if (!user) throw new AuthenticationError('User must be logged in.');
        return await governmentAPI.createGovernment(user, input);
    },
    async setCurrentGovernment(parent, {uid}, {user, dataSources: {governmentAPI}}) {
        if (!user) throw new AuthenticationError('User must be logged in.');
        return await governmentAPI.setCurrentGovernment(user, uid);
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers, objects);