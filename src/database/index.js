/**
 * Created by jovialis (Dylan Hanson) on 12/3/20
 **/

const mongoose = require('mongoose');
const config = require('../config');

// Use new create index
mongoose.set('useCreateIndex', true);

// Debug
if (!config.PRODUCTION) {
    mongoose.set('debug', true);
}

// Establish connection to database
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('🚀 Database connected.')
});

// Register models
require('./models/government');
require('./models/petition');
require('./models/tag');
require('./models/target');
require('./models/user');
require('./models/authenticator');
require('./models/role');
require('./models/roleholder');
require('./models/signature');

module.exports = mongoose;