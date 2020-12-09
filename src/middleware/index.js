/**
 * Created on 12/9/20 by jovialis (Dylan Hanson)
 **/

const sessions = require('./sessions');

const middlewares = [
    sessions
];

module.exports = function (app) {
    for (const middleware of middlewares) {
        middleware(app);
    }
}