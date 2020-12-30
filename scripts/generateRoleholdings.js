/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

require('./quickstart');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Role = mongoose.model('Role');
const Government = mongoose.model('Government');
const RoleHolder = mongoose.model('RoleHolder');

const faker = require('faker');

const NUM = 15;

(async function () {
    for (let i = 0 ; i < NUM ; ++i) {
        const user = await random(User);
        const sponsor = await random(User);
        const role = await random(Role);
        const government = await random(Government);

        try {
            await RoleHolder.create({
                sponsor,
                user,
                role,
                government
            });
        } catch (e) {
            console.log('SKIPPED DP');
            --i;
        }

    }
})().then(() => {
    console.log('DONE');
})

async function random(model) {
    const count = await model.count();

    // Get a random entry
    var random = Math.floor(Math.random() * count)

    // Again query all users but only fetch one offset by our random #
    return await model.findOne().skip(random);
}