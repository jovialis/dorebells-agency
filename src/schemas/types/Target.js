/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {ObjectSchemaPackage} = require('../../utils/schemaPackage');

/**
 * Defines the Government object schema for GraphQL. Must be compiled with generateSchema.
 * @type {string}
 */
const schema = `
    type Target {
        uid: ID!
        government: Government!
        
        name: String!
        
        petitions: [Petition]!
        
        createdOn: Date!
        creator: User!
    }
`;

const resolver = {
    Target: {
        async government(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTargetGovernment(parent.uid);
        },
        async petitions(parent, _args, { dataSources }) {
            return await dataSources.petitionAPI.getPetitionsByTarget(parent.uid);
        },
        async creator(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTargetCreator(parent.uid);
        },
    }
}

module.exports = new ObjectSchemaPackage(schema, resolver);