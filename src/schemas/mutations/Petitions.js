/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {AuthenticationError} = require('apollo-server');

const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    # Allows a logged in user to create a new petition.
    createPetition(input: CreatePetitionRequest!): Petition!
    
    # Creates a new tag
    createTag(government: ID, input: CreateTagRequest!): Tag!
    
    # Creates a new target
    createTarget(government: ID, input: CreateTargetRequest!): Target!
`;

const objects = `
    input CreatePetitionRequest {
        name: String!
        description: String!
        target: ID!
        tags: [ID]
    }
    
    input CreateTagRequest {
        name: String!
    }
    
    input CreateTargetRequest {
        name: String!
    }
`;

const resolvers = {
    async createPetition(parent, {input}, {user, dataSources: { petitionAPI }}) {
        if (!user) throw new AuthenticationError('User must be logged in.');
        return await petitionAPI.createPetition(user, input);
    },
    async createTag(parent, {government, input}, {user, dataSources: { petitionAPI }}) {
        if (!user) throw new AuthenticationError('User must be logged in.');
        return await petitionAPI.createTag(user, government, input);
    },
    async createTarget(parent, {government, input}, {user, dataSources: { petitionAPI }}) {
        if (!user) throw new AuthenticationError('User must be logged in.');
        return await petitionAPI.createTarget(user, government, input);
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers, objects);