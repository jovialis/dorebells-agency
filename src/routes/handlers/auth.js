/**
 * Created by jovialis (Dylan Hanson) on 9/11/20
 **/

const config = require('../../config');
const createError = require('http-errors');

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../../controllers/auth');

const passport = require('passport');
const Strategy = require('passport-google-oauth20').Strategy;

const User = mongoose.model('User');

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
            const { _id, uid } = await auth.loginUser(googleId, {name, thumbnail, email});
            cb(null, {_id, uid});
        } catch (e) {
            console.log(e);
            cb(null);
        }
    }
}));

passport.serializeUser(function (user, cb) {
    cb(null, user.uid);
});

// Configure passport
router.use(passport.initialize());

router.get(config.GOOGLE_OAUTH_ENDPOINT, passport.authenticate('google', {
    hd: config.ENFORCE_AUTHENTICATION_DOMAIN ? config.AUTHENTICATION_DOMAIN : undefined,
    prompt: config.ENFORCE_AUTHENTICATION_DOMAIN ? undefined : 'select_account',
    scope: ['email', 'profile', 'openid']
}));

router.get(config.GOOGLE_OAUTH_REDIRECT, passport.authenticate('google', {
    failureRedirect: '/login?failure=true'
}), (req, res) => {
    // Store user in session, vs. Passport so we don't have to re-fetch user every request
    req.session.user = req.user;

    const redirect = req.session.redirect;
    req.session.redirect = undefined;
    res.redirect(redirect ? redirect : '/');
});

router.get(config.LOGOUT_ENDPOINT, (req, res) => {
    req.session.user = null;
    res.redirect('/login');
});

module.exports = router;