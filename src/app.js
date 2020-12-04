/**
 * Created by jovialis (Dylan Hanson) on 12/3/20
 **/

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const config = require('./config');

// Routers import

// Start database
const mongoose = require('./db');

const app = express();

app.disable('x-powered-by');

app.use(logger(config.PRODUCTION ? 'short' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

module.exports = app;
