/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    # Allows a logged in user to fetch a petition by its ID.
    getPetition(id: ID!): Petition
`;

const resolvers = {
    getPetition(parent, {id}, context) {
        return null;
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers);