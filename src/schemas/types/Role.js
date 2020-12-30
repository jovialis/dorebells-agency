/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {ObjectSchemaPackage} = require('../../utils/schemaPackage');

/**
 * Defines the User object schema in GraphQL. Must be compiled with buildSchema
 * @type {string}
 */
const schema = `
    type Role {
        uid: ID!
        color: String!
        government: Government!
        name: String!
        permissions: [String]!
        createdOn: Date!
    }
`;

const resolver = {
    Role: {
        async government(parent, _args, {dataSources}) {
            return await dataSources.governmentAPI.getRoleGovernment(parent.uid);
        },
    }
};

module.exports = new ObjectSchemaPackage(schema, resolver);
