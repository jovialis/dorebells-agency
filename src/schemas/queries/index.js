/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {ObjectSchemaPackage} = require('../../utils/schemaPackage');

const Petitions = require('./Petitions');
const Users = require('./Users');

// ADD ALL NEW QUERIES HERE
const queries = [
    Petitions,
    Users
];

const schema = `
    type Query {
        ${ queries.map(q => q.signatures).join(`
        
        `) }
    }
    
    ${ queries.map(q => q.objects).join(`
    
    `) }
`;

const resolvers = {
    Query: {
    }
}

for (const query of queries) {
    resolvers.Query = {
        ...resolvers.Query,
        ...query.resolvers
    }
}

module.exports = new ObjectSchemaPackage(schema, resolvers);