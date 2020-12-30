/**
 * Created on 12/6/20 by jovialis (Dylan Hanson)
 **/

/**
 * Represents a set of default options for a database Query.
 * @field lean - Return a purely JSON document (super lightweight).
 * @field select - Which fields to return exclusively.
 * @field populate - Array or string representing field names to populate.
 * @type {{select: [], populate: [], lean: boolean}}
 */
const FastQueryOptions = {
    lean: true,
    select: [],
    populate: []
};

module.exports = {
    fastQuery,
    FastQueryOptions
};

/**
 * Provides an easy wrapper to query w/ options like select fields, populate fields, and lean the query.
 * @param query Base mongoose query to wrap and execute.
 * @param options
 * @returns {Promise<*>}
 */
async function fastQuery(query, options = DefaultQueryOptions) {
    if (typeof(options.select) === "string") {
        options.select = [options.select];
    }

    if (typeof(options.populate) === "string") {
        options.populate = [options.populate];
    }

    if (options.lean !== false) {
        query = query.lean();
    }

    if (options.select && options.select.length > 0) {
        query = query.select(options.select);
    }

    if (options.populate && options.populate.length > 0) {
        for (const field of options.populate) {
            if (typeof (field) === "string") {
                query = query.populate(field);
            } else {
                // Allow for population of specific subfields
                if (field.path && field.select) {
                    query = query.populate(field);
                }
            }
        }
    }

    return await query.exec();
}