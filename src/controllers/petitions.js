/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const Petition = mongoose.model('Petition');

const {optionsQuery, DefaultQueryOptions} = require('../utils/queryOptionsWrapper');

module.exports = {
    getPetitionsByGovernment
};

/**
 * Returns petitions for a given government.
 * @param government Mongoose Document or Document ID for a Government document.
 * @param options Query options.
 * @returns {Promise<[Document]>}
 */
async function getPetitionsByGovernment(government, options = DefaultQueryOptions) {
    return await optionsQuery(Petition.find({government}), options);
}