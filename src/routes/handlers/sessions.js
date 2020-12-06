/**
 * Created by jovialis (Dylan Hanson) on 9/12/20
 **/

const config = require('../../config');

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Preserve sessions
router.use(require('express-session')({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: config.PRODUCTION},
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

module.exports = router;