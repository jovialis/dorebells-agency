/**
 * Created on 12/17/20 by jovialis (Dylan Hanson)
 **/

require('./quickstart');

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Target = mongoose.model('Target');
const Tag = mongoose.model('Tag');
const Government = mongoose.model('Government');
const Petition = mongoose.model('Petition');

const faker = require('faker');

const NUM = 200;

(async function () {
    for (let i = 0 ; i < NUM ; ++i) {
        const user = await random(User);
        const gov = await random(Government);

        const target = await random(Target, {
            government: gov
        });

        const tagCount = Math.floor(Math.random() * 5) + 1;
        let tags = [];
        for (let x = 0 ; x < tagCount ; ++x) {
            tags.push(await random(Tag, {
                government: gov
            }))
        }

        const name = faker.lorem.sentence();
        const description = faker.lorem.paragraphs();

        try {
            await Petition.create({
                creator: user,
                government: gov,
                name: name,
                description,
                target,
                tags,
            });
        } catch (e) {
            console.log('SKIPPED DP');
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