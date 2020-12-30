/**
 * Created on 12/29/20 by jovialis (Dylan Hanson)
 **/

const {UserInputError, AuthenticationError} = require('apollo-server');

module.exports = {
    demand,
    demandUser
};

function demandUser(user) {
    if (!user) {
        throw new AuthenticationError('User must be logged in.');
    }
    return user;
}

function demand(val, message) {
    if (!val) {
        throw new UserInputError(message, {})
    }
    return val;
}