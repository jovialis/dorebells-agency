/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Authenticator = mongoose.model('Authenticator');

module.exports = {
    loginUser
};

async function loginUser(googleId, name, thumbnail, email) {

}