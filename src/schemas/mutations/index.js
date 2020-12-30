/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {ObjectSchemaPackage} = require('../../utils/schemaPackage');

// ADD ALL NEW MUTATIONS HERE
const mutations = [
    require('./Petitions'),
    require('./Governments'),
    require('./Users')
];

// Add all Mutations to a Schema
const schema = `
    type Mutation {
        ${ mutations.map(q => q.signatures).join(`
        
        `) }
    }
    
    ${ mutations.map(q => q.objects).join(`
    
    `) }
`;

// Add all Resolvers here
const resolvers = {
    Mutation: {}
};

for (const mutation of mutations) {
    resolvers.Mutation = {
        ...resolvers.Mutation,
        ...mutation.resolvers
    }
}

module.exports = new ObjectSchemaPackage(schema, resolvers);