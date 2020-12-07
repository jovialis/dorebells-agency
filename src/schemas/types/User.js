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
        authenticator: String
    }
    
    type Role {
        uid: ID!
        government: Government!
        name: String!
        permissions: [String]!
        createdOn: Date!
    }
`;

const resolver = {
    User: {
        async roles(parent, {government: governmentUID}, { dataSources }) {
            return await dataSources.userAPI.getRoles(parent.uid, governmentUID);
        },
        async permissions(parent, {government: governmentUID}, {dataSources}) {
            return await dataSources.userAPI.getPermissions(parent.uid, governmentUID);
        },
        async authenticator(parent, _args, {dataSources}) {
            return await dataSources.userAPI.getAuthenticator(parent.uid);
        }
    },
    Role: {
        async government(parent, _args, {dataSources}) {
            return await dataSources.userAPI.getRoleGovernment(parent.uid);
        },
    }
};

module.exports = new ObjectSchemaPackage(schema, resolver);
