/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {CompoundObjectSchemaPackage} = require('../../utils/schemaPackage');

const Date = require('./scalars/Date');

const User = require('./User');
const Government = require('./Government');
const Petition = require('./Petition');

module.exports = new CompoundObjectSchemaPackage([
    Date,

    User,
    Government,
    Petition
]);