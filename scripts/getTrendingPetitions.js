/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

require('./quickstart');

const petitions = require('../src/helpers/petitions');

(async function () {

    const start = Date.now();
    const trending = await petitions.getTrendingPetitions();

    const end = Date.now();
    console.log('did it in ' + ((end - start)) + "ms");



})().then(() => {
    console.log('DONE');
});