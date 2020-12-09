/**
 * Created on 12/5/20 by jovialis (Dylan Hanson)
 **/

module.exports = {
    ObjectSchemaPackage,
    MethodSchemaPackage,
    CompoundObjectSchemaPackage
};

function ObjectSchemaPackage(schema, resolver) {
    this.schema = schema;
    this.resolver = resolver;
}

function MethodSchemaPackage(signatures, resolvers = {}, objects = ``) {
    this.signatures = signatures;
    this.resolvers = resolvers;
    this.objects = objects;
}

function CompoundObjectSchemaPackage(objects) {
    this.schema = objects.map(o => o.schema).join(` `);
    this.resolver = {};

    objects.forEach(o => {
        this.resolver = {
            ...this.resolver,
            ...o.resolver
        };
    });
}