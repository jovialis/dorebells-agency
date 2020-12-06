/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

const express = require('express');
const router = express.Router();

const auth = require('./handlers/auth');
const sessions = require('./handlers/sessions');

// Use all required routes
router.use([
    auth,
    sessions
]);

module.exports = router;