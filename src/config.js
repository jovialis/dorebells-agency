/**
 * Created by jovialis (Dylan Hanson) on 12/3/20
 **/

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    PRODUCTION: process.env.NODE_ENV === 'production'
};