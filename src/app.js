/**
 * Created by jovialis (Dylan Hanson) on 12/3/20
 **/

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const {ApolloServer} = require('apollo-server-express');

const config = require('./config');

// Start database
require('./database');

// Set up Express server
const app = express();

app.use(logger(config.PRODUCTION ? 'short' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.SESSION_SECRET));

app.use(cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
}));

// Register middleware
const applyMiddleware = require('./middleware');
applyMiddleware(app);

// Register routes
const routes = require('./routes');
app.use(routes);

// Setup GQL
const schemas = require('./schemas');

const typeDefs = schemas.typeDefs;
const resolvers = schemas.resolvers;

// API Data sources
const GovernmentAPI = require('./datasources/GovernmentAPI');
const UserAPI = require('./datasources/UserAPI');
const PetitionAPI = require('./datasources/PetitionAPI');

const governmentAPI = new GovernmentAPI();
const userAPI = new UserAPI();
const petitionAPI = new PetitionAPI();

const UserPermissions = require('./utils/UserPermissions');

// Create and apply ApolloServer
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            governmentAPI,
            userAPI,
            petitionAPI
        };
    },
    context: async ({req}) => {
        if (req.user) {
            const user = req.user;

            // Instantiate user permissions fetch.
            // const permissions = new UserPermissions(user._id, user.uid);
            // await permissions.load(userAPI, governmentAPI);

            return {
                // Barebones User object, featuring the fields uid and _id only.
                user: {
                    _id: user._id,
                    uid: user.uid,
                    // permissions
                }
            };
        } else {
            return {
                user: null
            };
        }
    }
})

server.applyMiddleware({ app });

module.exports = app;
