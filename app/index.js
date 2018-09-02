const express = require('express');
const http = require('http');
const RouteMapper = require('./core/RouteMapper');
const Middleware = require('./core/Middleware');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const port = argv.port || '8080';
require('./helpers/helpers.js');

let app = express();
let server = http.createServer(app);

/**
 * MIDDLEWARE
 ********************* */
let middleware = new Middleware(app, express);

/**
 * ROUTES
 ********************* */
let routes = new RouteMapper();
routes.mapControllers(app);

/**
 * Default Routes
 ********************* */
app.use((req, res, next) => {
    res.status(404).send('Not found')
});

app.use((req, res, next) => {
    res.status(500);
    res.render(path.join(__dirname,'core/views/500'), {
        title: 'Internal Server Error !',
    });
});

server.listen(port);
console.log(`Server started on localhost:${port}\n`);
process.on('uncaughtException', function (err) {
    console.log(err);
});