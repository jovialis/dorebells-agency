/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

const express = require('express');
const router = express.Router();

const auth = require('./auth');

// Use all required routes
router.use(auth);

module.exports = router;