/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');

const User = mongoose.model('User');
const Authenticator = mongoose.model('Authenticator');
const GoogleAuthenticator = mongoose.model('GoogleAuthenticator');

module.exports = {
    loginUser
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
 * Logins in or creates a User by their Google ID.
 * @param googleId
 * @param profile
 * @returns {Promise<User>}
 */
async function loginUser(googleId, profile) {
    // If the user exists, log them in. Otherwise, create a new account.
    if (await userExistsByGoogleID(googleId)) {
        const user = await getUserByGoogleID(googleId);

        // Update the user's last login
        await User.updateOne({
            uid: user.uid
        }, {
            lastLogin: Date.now()
        });

        return user;
    } else {
        return await createGoogleUser(googleId, profile);
    }
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