/**
 * Created on 12/7/20 by jovialis (Dylan Hanson)
 **/

const mongoose = require('mongoose');
const {GraphQLScalarType} = require('graphql');
const { Kind } = require('graphql/language');

const {ObjectSchemaPackage} = require('../../../utils/schemaPackage');

/**
 * Defines the Date object schema for GraphQL. Must be compiled with generateSchema.
 * @type {string}
 */
const schema = `
    scalar Date
`;

const resolver = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        }
    })
};

module.exports = new ObjectSchemaPackage(schema, resolver);