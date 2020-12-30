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
        thumbnail: String!
        email: String!
        lastLogin: Date!
        firstLogin: Date!
        roles(government: ID): [Role]!
        permissions(government: ID): [String]!
    }
`;

const resolver = {
    User: {
        async roles(parent, {government: governmentUID}, { dataSources }) {
            return await dataSources.userAPI.getUserRoles(parent.uid, governmentUID);
        },
        async permissions(parent, {government: governmentUID}, {dataSources}) {
            return await dataSources.userAPI.getUserPermissions(parent.uid, governmentUID);
        }
    }
};

module.exports = new ObjectSchemaPackage(schema, resolver);
