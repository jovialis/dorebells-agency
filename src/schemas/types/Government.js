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
    }
`;

const resolver = {
    Government: {
        async creator(parent, _args, { dataSources }) {
            return dataSources.governmentAPI.getCreator(parent.uid);
        },
        async petitions(parent, _args, { dataSources }) {
            return dataSources.governmentAPI.getPetitions(parent.uid);
        },
        async members(parent, _args, { dataSources }) {
            return dataSources.governmentAPI.getMembers(parent.uid);
        }
    }
}

module.exports = new ObjectSchemaPackage(schema, resolver);