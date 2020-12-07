/**
 * Created by jovialis (Dylan Hanson) on 12/3/20
 **/

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {ApolloServer} = require('apollo-server-express');

const config = require('./config');

// Start database
require('./database');

// Set up Express server
const app = express();

app.disable('x-powered-by');

app.use(logger(config.PRODUCTION ? 'short' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

// Create and apply ApolloServer
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            governmentAPI: new GovernmentAPI(),
            userAPI: new UserAPI(),
            petitionAPI: new PetitionAPI()
        };
    },
    context: ({req}) => ({
        // Barebones User object, featuring the fields uid and _id only.
        user: req.session.user
    })
})

server.applyMiddleware({ app });

module.exports = app;
