/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {CompoundObjectSchemaPackage} = require('../../utils/schemaPackage');

const User = require('./User');
const Government = require('./Government');

module.exports = new CompoundObjectSchemaPackage([
    User,
    Government
]);