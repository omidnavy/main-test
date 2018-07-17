const express = require('express');
const path = require('path');
const session = require('express-session');
const compression = require('compression');

module.exports = class Middleware {
    constructor(app, express) {
        this.app = app;
        this.express = express;
        this.useMiddleware();
    }

    useMiddleware() {
        if (global.PROD_ENV) {
            this.app.use(compression());
        }

        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: true,
        }));


        this.app.use(session({
            secret: 'sUperS3cr3t',
            cookie: {maxAge: 2628000000},
            saveUninitialized: true,
            resave: true,
        }));

        this.app.set('view engine', 'ejs');
        this.app.use(this.express.static(path.join(__dirname, '../assets')));
    }
};
