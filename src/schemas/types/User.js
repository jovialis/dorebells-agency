/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {ObjectSchemaPackage} = require('../../utils/schemaPackage');

/**
 * Defines the User object schema in GraphQL. Must be compiled with buildSchema
 * @type {string}
 */
const schema = `
    type User {
        uid: ID!
        name: String!
        email: String!
        roles(government: ID!): [Role]!
    }
`;

const resolver = {
    User: {
        async roles(parent, {government: governmentUID}, { dataSources }) {
            return dataSources.userAPI.getRoles(parent.uid, governmentUID);
        }
    }
};

module.exports = new ObjectSchemaPackage(schema, resolver);
