/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

const {ObjectSchemaPackage} = require('../../utils/schemaPackage');

/**
 * Defines the Government object schema for GraphQL. Must be compiled with generateSchema.
 * @type {string}
 */
const schema = `
    type Petition {
        uid: ID!
        creator: User!
        
        government: Government!
        target: Target!
        tags: [Tag]!

        title: String!
        description: String!
        
        createdOn: Date!
        
        signatureCount: Int!
        signatures: [Signature]!
    }
    
    type Tag {
        uid: ID!
        government: Government!
        
        name: String!
        
        createdOn: Date!
        creator: User!
        
        petitions: [Petition]!
    }
    
    type Target {
        uid: ID!
        government: Government!
        
        name: String!
        
        petitions: [Petition]!
        
        createdOn: Date!
        creator: User!
    }
    
    type Signature {
        uid: ID!
        
        petition: Petition!
        user: User!
        
        referrer: Signature
        comment: String
        
        referralCode: String!
        numReferrals: Int!
        
        createdOn: Date!
    }
`;

const resolver = {
    Petition: {
        async creator(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getCreator(parent.uid);
        },
        async government(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getGovernment(parent.uid);
        },
        async target(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTarget(parent.uid);
        },
        async tags(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTags(parent.uid);
        },
        async signatureCount(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionSignatureCount(parent.uid)
        },
        async signatures(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getSignatures(parent.uid);
        }
    },
    Tag: {
        async government(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTagGovernment(parent.uid);
        },
        async petitions(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionsByTag(parent.uid);
        },
        async creator(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTagCreator(parent.uid);
        },
    },
    Target: {
        async government(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTargetGovernment(parent.uid);
        },
        async petitions(parent, _args, { dataSources }) {
            return await dataSources.petitionAPI.getPetitionsByTarget(parent.uid);
        },
        async creator(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getTargetCreator(parent.uid);
        },
    },
    Signature: {
        async petition(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getSignaturePetition(parent.uid);
        },
        async user(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getSignatureUser(parent.uid);
        },
        async referrer(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getSignatureReferrer(parent.uid);
        },
        async numReferrals(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getSignatureReferralCount(parent.uid);
        }
    }
}

module.exports = new ObjectSchemaPackage(schema, resolver);