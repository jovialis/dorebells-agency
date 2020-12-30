/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {CompoundObjectSchemaPackage} = require('../../utils/schemaPackage');

module.exports = new CompoundObjectSchemaPackage([
    require('./scalars/Date'),

    require('./User'),
    require('./Government'),
    require('./Petition'),
    require('./Role'),
    require('./Tag'),
    require('./Target')
]);