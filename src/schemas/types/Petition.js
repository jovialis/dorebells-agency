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

        name: String!
        description: String!
        
        createdOn: Date!
        
        signatureCount: Int!
        signatures: [Signature]!
        
        commentCount: Int!
        comments: [Signature]!
        
        canSign: Boolean!
    }
    
    type Signature {
        uid: ID!
        
        petition: Petition!
        user: User!
        
        # Who referred the signer to the petition.
        referrer: Signature
        comment: String
        
        referralCode: String!
        numReferrals: Int!
        
        createdOn: Date!
        
        likeCount: Int!
        likes: [SignatureLike]!
        
        canLike: Boolean!
    }
    
    type SignatureLike {
        user: User!
        timestamp: Date!
    }
`;

const resolver = {
    Petition: {
        async creator(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionCreator(parent.uid);
        },
        async government(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionGovernment(parent.uid);
        },
        async target(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionTarget(parent.uid);
        },
        async tags(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionTags(parent.uid);
        },
        async signatureCount(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionSignatureCount(parent.uid)
        },
        async signatures(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionSignatures(parent.uid);
        },
        async commentCount(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionCommentCount(parent.uid);
        },
        async comments(parent, _args, {dataSources}) {
            return await dataSources.petitionAPI.getPetitionComments(parent.uid);
        },
        async canSign(parent, _args, {dataSources}) {
            return !(await dataSources.petitionAPI.userHasSigned(parent.uid));
        }
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
        },
        likeCount(parent, _args, {dataSources}) {
            return parent.likes ? parent.likes.length : 0;
        },
        async canLike(parent, _args, {dataSources}) {
            return !(await dataSources.petitionAPI.userHasLiked(parent.uid));
        }
    },
    SignatureLike: {
        async user(parent, _args, {dataSources}) {
            return await dataSources.userAPI.getUserByObjectID(parent.user);
        }
    }
}

module.exports = new ObjectSchemaPackage(schema, resolver);