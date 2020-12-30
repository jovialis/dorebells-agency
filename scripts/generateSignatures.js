/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

require('./quickstart');

const mongoose = require('mongoose');
const User = mongoose.model('User');

const Petition = mongoose.model('Petition');
const Signature = mongoose.model('Signature');

const faker = require('faker');

const NUM = 500;

(async function () {
    for (let i = 0 ; i < NUM ; ++i) {
        const user = await random(User);
        const petition = await random(Petition);

        const description = faker.lorem.paragraph();

        try {
            await Signature.create({
                user: user,
                petition: petition,
                comment: description
            });
        } catch (e) {
            console.log(e);
            --i;
        }

    }
})().then(() => {
    console.log('DONE');
})

async function random(model, query) {
    const count = await model.countDocuments(query);

    // Get a random entry
    var random = Math.floor(Math.random() * count)

    // Again query all users but only fetch one offset by our random #
    return await model.findOne(query).skip(random);
}