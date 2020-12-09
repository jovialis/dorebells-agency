/**
 * Created by jovialis (Dylan Hanson) on 9/12/20
 **/

const config = require('../config');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = function (app) {
    // Preserve sessions
    app.use(session({
        name: 'dorebells.sid',
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {secure: config.PRODUCTION},
        store: new MongoStore({mongooseConnection: mongoose.connection}),
    }));
};