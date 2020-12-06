/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    # Allows a logged in user to create a new petition.
    createPetition(request: CreatePetitionRequest!): [Petition]!
`;

const objects = `
    input CreatePetitionRequest {
        title: String!
        description: String!
        target: ID!
        tags: [ID]!
    }
`;

const resolvers = {
    createPetition() {

    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers, objects);