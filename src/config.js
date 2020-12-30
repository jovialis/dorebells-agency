/**
 * Created by jovialis (Dylan Hanson) on 12/3/20
 **/

module.exports = {
    // Server Config Stuff
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    PRODUCTION: process.env.NODE_ENV === 'production',
    DEVELOPMENT: process.env.NODE_ENV !== 'production',

    // Application Settings
    ENFORCE_AUTHENTICATION_DOMAIN: process.env.ENFORCE_DOMAIN_AUTHENTICATION, // Whether to only allow Vanderbilt-specific emails
    AUTHENTICATION_DOMAIN: process.env.AUTHENTICATION_DOMAIN, // The Vanderbilt email extension (vanderbilt.edu)

    // CORS stuff
    CORS_ORIGINS: (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),

    // Session Stuff
    SESSION_SECRET: process.env.SESSION_SECRET,

    // Authorization token
    LOGIN_TOKEN_NAME: process.env.LOGIN_TOKEN_NAME,

    // Google Authorization Stuff
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    GOOGLE_OAUTH_REDIRECT: process.env.GOOGLE_OAUTH_REDIRECT,
    GOOGLE_OAUTH_ENDPOINT: process.env.GOOGLE_OAUTH_ENDPOINT,

    LOGOUT_ENDPOINT: process.env.LOGOUT_ENDPOINT,
};