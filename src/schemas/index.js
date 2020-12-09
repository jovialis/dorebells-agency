/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {gql} = require('apollo-server');

const types = require('./types');
const queries = require('./queries');
const mutations = require('./mutations');

/**
 * Compiles all Objects, Queries, and Mutations into a single Schema
 */
const typeDefs = gql`
    # All Object definitions
    ${ types.schema }
    
    # All Query definitions
    ${ queries.schema }
    
    # All Mutation Definitions
    ${ mutations.schema }
`;

/**
 * Compiles all resolvers into a single object.
 */
const resolvers = {
    ...types.resolver,
    ...queries.resolver,
    ...mutations.resolver
};

/**
 * Exports a list of typeDefs and resolvers to be used in ApolloServer.
 * @type {{typeDefs: DocumentNode, resolvers: {}}}
 */
module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}