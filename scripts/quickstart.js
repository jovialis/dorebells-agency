/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

/**
 * Load environmental variables
 */


const res = require('dotenv').config({
    path: '../.env'
});

require('../src/database');