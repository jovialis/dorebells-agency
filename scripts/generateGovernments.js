/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

require('./quickstart');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Government = mongoose.model('Government');

const faker = require('faker');

const NUM = 5;

(async function () {
    for (let i = 0 ; i < NUM ; ++i) {
        const user = await random(User);

        await Government.create({
            creator: user,
            name: user.name + ' Government'
        });
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