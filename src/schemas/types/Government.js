/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const {ObjectSchemaPackage} = require('../../utils/schemaPackage');

/**
 * Defines the Government object schema for GraphQL. Must be compiled with generateSchema.
 * @type {string}
 */
const schema = `
    type Government {
        uid: ID!
        name: String!
        creator: User!
        petitions: [Petition]!
        members: [User]!
        current: Boolean
        createdOn: Date!
        archived: Boolean!
        roles: [Role]!
    }
`;

const resolver = {
    Government: {
        async creator(parent, _args, { dataSources }) {
            return dataSources.governmentAPI.getGovernmentCreator(parent.uid);
        },
        async petitions(parent, _args, { dataSources }) {
            return dataSources.governmentAPI.getGovernmentPetitions(parent.uid);
        },
        async members(parent, _args, { dataSources }) {
            return dataSources.governmentAPI.getGovernmentMembers(parent.uid);
        },
        async createdOn(parent) {
            return parent.timestamp;
        },
        async roles(parent, _args, {dataSources}) {
            return dataSources.governmentAPI.getGovernmentRoles(parent.uid);
        },
        archived(parent) {
            return parent.archived ? parent.archived : false;
        }
    }
}

module.exports = new ObjectSchemaPackage(schema, resolver);