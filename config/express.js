var express = require('express'),
    prerenderNode = require('prerender-node'),
    Config = require('../config/config')[process.env['NODE_ENV']];

module.exports = function(app, passport) {

    app.set('port', process.env.PORT || 5000);
    app.set('mongo_uri', Config.mongo_uri);
    app.set('showStackError', true);

    app.use(express.compress({
        filter: function(req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9 
    }));

    app.use(express.logger({immediate: false, format: 'dev'}));

    app.configure(function() {
        app.use(express.cookieParser());

        app.use(express.bodyParser({uploadDir: __dirname + '/../public/images'}));
        app.use(express.methodOverride());

        app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', Config.allowedDomains);
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });

        app.use(passport.initialize());

        if (process.env.DYNO) {
            console.log('prerender set');
            app.use(prerenderNode.set('prerenderToken', Config.prerenderToken));
            console.log('Prerender linking started');
        }

        app.use(app.router);

    });

    // development env config
    app.configure('development', function() {
        app.locals.pretty = true;
    });
};