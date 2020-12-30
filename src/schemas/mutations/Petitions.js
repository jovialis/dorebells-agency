/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const permissions = require('../../permissions');
const {AuthenticationError} = require('apollo-server');

const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    # Allows a logged in user to create a new petition.
    createPetition(input: CreatePetitionRequest!): Petition!
    
    # Creates a new tag
    createTag(government: ID, input: CreateTagRequest!): Tag!
    
    # Creates a new target
    createTarget(government: ID, input: CreateTargetRequest!): Target!
    
    # Signs a given petition
    signPetition(petition: ID!, input: SignPetitionRequest!): Signature!
    
    # Likes a comment
    likeSignature(signature: ID!): Signature!
`;

const objects = `
    input CreatePetitionRequest {
        name: String!
        description: String!
        target: ID!
        tags: [ID]
    }
    
    input SignPetitionRequest {
        referer: ID
        comment: String
    }
    
    input CreateTagRequest {
        name: String!
    }
    
    input CreateTargetRequest {
        name: String!
    }
`;

const resolvers = {
    async signPetition(parent, {petition, input}, {dataSources}) {
        return await dataSources.petitionAPI.signPetition(petition, input);
    },
    async createPetition(parent, {input}, {dataSources}) {
        return await dataSources.petitionAPI.createPetition(input);
    },
    async createTag(parent, {government, input}, {dataSources}) {
        return await dataSources.petitionAPI.createTag(government, input);
    },
    async createTarget(parent, {government, input}, {dataSources}) {
        return await dataSources.petitionAPI.createTarget(government, input);
    },
    async likeSignature(parent, {signature}, {dataSources}) {
        return await dataSources.petitionAPI.likeSignature(signature)
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers, objects);