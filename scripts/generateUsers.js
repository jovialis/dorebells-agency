/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

require('./quickstart');

const mongoose = require('mongoose');
const User = mongoose.model('User');

const faker = require('faker');

const NUM_USERS = 23;

(async function () {
    for (let i = 0 ; i < NUM_USERS ; ++i) {
        const email = faker.internet.email();
        const name = faker.name.findName();
        const thumbnail = faker.image.imageUrl();

        await User.create({email, name, thumbnail});
    }
})().then(() => {
    console.log('DONE');
})

