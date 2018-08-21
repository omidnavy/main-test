const express = require('express');
const path = require('path');
const compression = require('compression');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const salt = '$om3T!ngStR0nG';
const RouteDictionary = require('./RouteDictionary');

module.exports = class Middleware {
    constructor(app, express) {
        this.app = app;
        this.express = express;
        this.useMiddleware();
    }

    useMiddleware() {
        if (global.PROD_ENV) this.app.use(compression());

        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: true,
        }));


        this.app.use(session({
            store: new RedisStore({host: '192.168.0.7'}),
            secret: salt,
            cookie: {maxAge: 2628000000},
            saveUninitialized: true,
            resave: false,
        }));

        this.app.use((req, res, next) => {
            let role = 0;
            if (req.session.isAuthenticate) {
                if (req.session.userInfo.Status === 0) return res.redirect('/active');
                if (req.session.userInfo.Status > 1) return res.status(401).send('You don\'t have access');
                role = req.session.userInfo.Role;
                console.log(req.session.userInfo)
            }
            let placeInDictionary = `${req.path}/${req.method}`.replace('/', '').split('/');
            let privilege = RouteDictionary;
            let error = false;
            let wildcard = false;
            for (let t in placeInDictionary) {
                if (privilege['*']) wildcard = privilege['*']; //* key as default privilege for all children routs
                if (privilege[placeInDictionary[t]]) privilege = privilege[placeInDictionary[t]]; //if route exists in our dictionary
                else error = true; //route not exists
            }
            if (error) { //if route not exists
                if (wildcard) privilege = wildcard; //if it has a parent wildcard privilege defined
                else return res.sendStatus(404);
            }
            if (privilege === '*' || privilege.includes(role)) next();
            else return res.sendStatus(403)
        });
        this.app.set('view engine', 'ejs');
        this.app.use(this.express.static(path.join(__dirname, '../assets')));
    }
};
