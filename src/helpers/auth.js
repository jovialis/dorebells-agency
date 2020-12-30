/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const config = require('../config');

const User = mongoose.model('User');
const Authenticator = mongoose.model('Authenticator');
const GoogleAuthenticator = mongoose.model('GoogleAuthenticator');

module.exports = {
    loginGoogleUser
};

/**
 * Fetches a User by their Google Authenticator ID.
 * @param googleId
 * @returns {Promise<User>}
 */
async function getUserByGoogleID(googleId) {
    // Fetches Authenticator and populates User.
    const auth = await GoogleAuthenticator
        .findOne({ googleAccountId: googleId })
        .lean()
        .select('user')
        .populate('user');

    return auth.user;
}

/**
 * Returns whether a user exists with a given Google account
 * @param googleId
 * @returns {Promise<boolean>}
 */
async function userExistsByGoogleID(googleId) {
    return await GoogleAuthenticator.countDocuments({ googleAccountId: googleId }) > 0;
}

/**
 * Logins in or creates a User by their Google ID. Returns a JWT token.
 * @param googleId
 * @param profile
 * @returns {Promise<String>}
 */
async function loginGoogleUser(googleId, profile) {
    let user;

    // If the user exists, log them in. Otherwise, create a new account.
    if (await userExistsByGoogleID(googleId)) {
        user = await getUserByGoogleID(googleId);

        // Update the user's last login
        await User.updateOne({
            uid: user.uid
        }, {
            lastLogin: Date.now()
        });

    } else {
        user = await createGoogleUser(googleId, profile);
    }

    // Create JWT and return
    const tokenContents = {
        uid: user.uid,
        _id: user._id
    };

    // Sign and return.
    return jwt.sign(tokenContents, config.SESSION_SECRET, {
        issuer: 'agency'
    });
}

/**
 * Creates a new User from a Google account with a GoogleID and profile info.
 * @param googleId
 * @param name
 * @param thumbnail
 * @param email
 * @returns {Promise<User>}
 */
async function createGoogleUser(googleId, {name, thumbnail, email}) {
    // Create ObjectIDs for both
    const userId = new mongoose.Types.ObjectId();
    const authenticatorId = new mongoose.Types.ObjectId();

    // Create user
    const user = await User.create({
        _id: userId,
        email,
        name,
        thumbnail,
        authenticator: authenticatorId
    });

    // Create authenticator
    await GoogleAuthenticator.create({
        _id: authenticatorId,
        user: userId,
        googleAccountId: googleId
    });

    return user.toObject();
}