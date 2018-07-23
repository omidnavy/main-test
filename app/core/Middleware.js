const express = require('express');
const path = require('path');
const compression = require('compression');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const salt = '$om3T!ngStR0nG';

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
            store: new RedisStore({host:'192.168.0.7'}),
            secret: salt,
            cookie: {maxAge: 2628000000},
            saveUninitialized: true,
            resave: false,
        }));

        this.app.set('view engine', 'ejs');
        this.app.use(this.express.static(path.join(__dirname, '../assets')));
    }
};
