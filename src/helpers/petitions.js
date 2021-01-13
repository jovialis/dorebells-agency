/**
 * Created on 12/30/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const Petition = mongoose.model('Petition');
const dayjs = require('dayjs')

const lookup = require('./lookup');
const logic = require('../utils/logic');

module.exports = {
    getRecentPetitions,
    getTopPetitions,
    getTrendingPetitions,
    getRelatedPetitions
};

// Returns the top petitions for a given government
async function getTopPetitions(government, limit = 20) {
    // Make sure the government exists
    government = logic.demand(government, 'Government is required.');

    // Find the best petitions
    return Petition
        .aggregate([
            // Find petitions in this government
            {
                $match: {
                    government: mongoose.Types.ObjectId(government._id)
                }
            },
            // For each petition, find a list of its signatures.
            {
                $lookup: {
                    from: 'signatures',
                    localField: '_id',
                    foreignField: 'petition',
                    as: 'signatures'
                }
            },
            // Add a field for the number of signatures
            {
                $addFields: {
                    signatureCount: {
                        $size: '$signatures'
                    }
                }
            },
            // Add a field for the number of signatures
            {
                $sort: {
                    signatureCount: -1
                }
            },
            // Limit to a number
            {
                $limit: limit
            },
            // Remove the signatureCount
            {
                $project: {
                    signatureCount: 0,
                    signatures: 0
                }
            }
        ]);
}

// Returns the most recent petitions.
async function getRecentPetitions() {

}

/**
 * Returns a list of the top {$limit} trending petitions, calculated by popularity over the past two weeks.
 * Petitions with more, recent signatures will be ranked higher than petitions with fewer signatures over
 * a long period of time or lots of signatures a few weeks ago.
 * @returns {Petition[]}
 */
async function getTrendingPetitions(limit = 20) {
    // Look for petitions in the current Government
    const government = logic.demand(
        await lookup.getGovernmentObjectByUID(null),
        "Current Government not found."
    );

    const now = dayjs().toDate();

    // Determine signature timestamp floor (earliest signatures that will be factored into trending status)
    const signatureCreationFloor = dayjs().subtract(2, 'week').toDate();

    // Rank number of signatures in the past day
    return Petition.aggregate([
        // Find petitions belonging to the current Government
        {
            $match: {
                government: mongoose.Types.ObjectId(government._id)
            }
        },
        // For each signature, find a list of its signatures.
        {
            $lookup: {
                from: 'signatures',
                localField: '_id',
                foreignField: 'petition',
                as: 'signatures'
            }
        },
        // Filter out signatures that were added earlier than the Signature Creation Floor
        {
            // All fields that were created at least two weeks ago
            $addFields: {
                signatures: {
                    $filter: {
                        input: '$signatures',
                        as: 'signature',
                        cond: {$gte: ["$$signature.createdOn", signatureCreationFloor]}
                    }
                }
            }
        },
        // Calculate a score for each Signature of each Petition
        {
            // Map array of signatures to an array of weights, with older signatures being worth less.
            $addFields: {
                signatureWeights: {
                    $map: {
                        input: "$signatures",
                        as: 'signature',
                        in: { // "$$signature.createdOn"
                            // t = now-creationDate / 86400000
                            // 5e^{-0.25t}
                            $multiply: [
                                5,
                                {
                                    // Raise e^power
                                    $exp: {
                                        // Exponent is -.25*t
                                        $multiply: [
                                            -0.25,
                                            {
                                                // Determine how many days since signing
                                                $divide: [
                                                    // Get how many millis have passed since signing
                                                    {
                                                        $subtract: [
                                                            now,
                                                            "$$signature.createdOn"
                                                        ]
                                                    },
                                                    // Number of milliseconds in a day
                                                    86400000
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        // Sum up the score for each signature to get a weight for each petition
        {
            $addFields: {
                weight: {
                    $sum: '$signatureWeights'
                }
            }
        },
        // Sort petitions by weight
        {
            $sort: {
                weight: -1
            }
        },
        // Limit the number of petitions to return
        {
            $limit: limit
        },
        // Remove projected/added fields.
        {
            $project: {
                signatures: 0,
                signatureWeights: 0,
                weight: 0
            }
        }
    ]);
}

async function getRelatedPetitions(petition) {

}