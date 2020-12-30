/**
 * Created by jovialis (Dylan Hanson) on 9/12/20
 **/

const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = function(app) {
    app.use((req, res, next) => {
        let token;
        if (req.cookies[config.LOGIN_TOKEN_NAME]) {
            // Verify with cookie
            token = req.cookies[config.LOGIN_TOKEN_NAME];
        } else if (req.get('Authorization')) {
            // Verify with server-provided Header
            token = req.get('Authorization').split(' ')[1];
        }

        try {
            req.user = jwt.verify(token, config.SESSION_SECRET);
        } catch (e) {}

        return next();
    });
};