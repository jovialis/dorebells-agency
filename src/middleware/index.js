/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

// const sessions = require('./sessions');


const middlewares = [
    // sessions
    require('./auth')
];

module.exports = function (app) {
    for (const middleware of middlewares) {
        middleware(app);
    }
}