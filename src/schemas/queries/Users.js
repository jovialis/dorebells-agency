/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

const permissions = require('../../permissions');
const {AuthenticationError} = require('apollo-server');
const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    # Allows a logged in user to fetch their own information
    me: User
    
    # Allows a logged in user to fetch someone else's information
    user(id: ID!): User!
`;

const resolvers = {
    async me(parent, _args, {dataSources}) {
        return await dataSources.userAPI.getMe();
    },
    async user(parent, {id}, {dataSources}) {
        return await dataSources.userAPI.getUser(id);
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers);