/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

const config = require('../config');
const createError = require('http-errors');

const express = require('express');
const router = express.Router();

const passport = require('passport');
const Strategy = require('passport-google-oauth20').Strategy;

const auth = require('../helpers/auth');

// Configure Passport for client authentication
passport.use(new Strategy({

    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_OAUTH_REDIRECT

}, async function (accessToken, refreshToken, profile, cb) {
    if (
        config.ENFORCE_AUTHENTICATION_DOMAIN && (
            !profile._json.hd ||
            profile._json.hd.toLowerCase() !== config.AUTHENTICATION_DOMAIN
        )
    ) {
        cb(null);
    } else {
        // Handle the google profile
        const {sub: googleId, name, picture: thumbnail, email} = profile._json;

        // Log in the user
        try {
            const token = await auth.loginGoogleUser(googleId, {name, thumbnail, email});
            cb(null, token);
        } catch (e) {
            console.log(e);
            cb(null);
        }
    }
}));

passport.serializeUser(function (token, cb) {
    cb(null, token);
});

// Configure passport
router.use(passport.initialize());

// Make sure this is only callable by Oscar server.
router.get(config.GOOGLE_OAUTH_ENDPOINT, [
    passport.authenticate('google')
], (req, res) => {
    // Store user in session, vs. Passport so we don't have to re-fetch user every request
    const token = req.user;
    if (!token) {
        throw new createError(500, "Something went wrong when authenticating user.");
    }

    res.json({
        token
    });
});

module.exports = router;