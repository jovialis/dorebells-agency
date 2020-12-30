/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {ObjectSchemaPackage} = require('../../utils/schemaPackage');

/**
 * Defines the Government object schema for GraphQL. Must be compiled with generateSchema.
 * @type {string}
 */
const schema = `
    type Tag {
        uid: ID!
        government: Government!
        
        name: String!
        
        createdOn: Date!
        creator: User!
        
        petitions: [Petition]!
    }
`;

const resolver = {
    Tag: {
        async government(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTagGovernment(parent.uid);
        },
        async petitions(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionsByTag(parent.uid);
        },
        async creator(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTagCreator(parent.uid);
        },
    }
}

module.exports = new ObjectSchemaPackage(schema, resolver);