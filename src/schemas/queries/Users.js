/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

const {AuthenticationError} = require('apollo-server');
const {MethodSchemaPackage} = require('../../utils/schemaPackage');

const signatures = `
    # Allows a logged in user to fetch their own information
    getMe: User!
    
    # Allows a logged in user to fetch someone else's information
    getUser(user: ID!): User!
`;

const resolvers = {
    async getMe(parent, _args, {user, dataSources: { userAPI }}) {
        if (!user) throw new AuthenticationError("User must be logged in!");
        return userAPI.getUser(user.uid);
    },
    async getUser(parent, {user: userUID}, {user, dataSources: {userAPI}}) {
        if (!user) throw new AuthenticationError("User must be logged in!");
        return userAPI.getUser(userUID);
    }
};

module.exports = new MethodSchemaPackage(signatures, resolvers);