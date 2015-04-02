var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);


    server.route({
        method: 'GET',
        path: options.basePath + '/musician',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    contactLastName: Joi.string().allow(''),
                    performerName: Joi.string().allow(''),
                    fields: Joi.string(),
                    sort: Joi.string().default('_id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var Musician = request.server.plugins['hapi-mongo-models'].Musician;
            var query = {};
            if (request.query.performerName) {
                query.performerLastName = new RegExp('^.*?' + request.query.performerLastName + '.*$', 'i');
            }
            if (request.query.contactLastName) {
                query.contactLastName = new RegExp('^.*?' + request.query.contactLastName + '.*$', 'i');
            }
            var fields = request.query.fields;
            var sort = request.query.sort;
            var limit = request.query.limit;
            var page = request.query.page;

            Musician.pagedFind(query, fields, sort, limit, page, function (err, results) {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: options.basePath + '/musician/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var Musician = request.server.plugins['hapi-mongo-models'].Musician;

            Musician.findById(request.params.id, function (err, status) {

                if (err) {
                    return reply(err);
                }

                if (!status) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply(status);
            });
        }
    });


    server.route({
        method: 'POST',
        path: options.basePath + '/musician',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    performerName: Joi.string().required(),
                    contactFirstName: Joi.string().required(),
                    contactLastName: Joi.string().required(),
                    address1: Joi.string().required()
                    //address1: Joi.string().required(),
                    //address2: Joi.string(),
                    //city: Joi.string().required,
                    //state: Joi.string().required,
                    //zipcode: Joi.string().required,
                    //phone: Joi.string().required,
                    //website: Joi.string()
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var Musician = request.server.plugins['hapi-mongo-models'].Musician;
            //var performerName = request.payload.performerName;
            //var contactFirstName = request.payload.contactFirstName;
            //var contactLastName = request.payload.contactLastName;

            Musician.create(request.payload, function (err, status) {

                if (err) {
                    return reply(err);
                }

                reply(status);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: options.basePath + '/musician/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    id: Joi.string(),
                    performerName: Joi.string(),
                    contactFirstName: Joi.string(),
                    contactLastName: Joi.string(),
                    address1: Joi.string()

                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var Musician = request.server.plugins['hapi-mongo-models'].Musician;
            var id = request.params.id;
            var update = {
                $set: {
                    performerName: request.payload.performerName,
                    contactFirstName: request.payload.contactFirstName,
                    contactLastName: request.payload.contactLastName,
                    address1: request.payload.address1
                }
            };

            Musician.findByIdAndUpdate(id, update, function (err, status) {

                if (err) {
                    return reply(err);
                }

                reply(status);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: options.basePath + '/musician/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            var Musician = request.server.plugins['hapi-mongo-models'].Musician;

            Musician.findByIdAndRemove(request.params.id, function (err, count) {

                if (err) {
                    return reply(err);
                }

                if (count === 0) {
                    return reply({ message: 'Document not found.' }).code(404);
                }

                reply({ message: 'Success.' });
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'musician'
};
