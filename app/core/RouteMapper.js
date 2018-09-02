const express = require('express');
const path = require('path');
const fs = require('fs');

module.exports = class RouteMapper {

    constructor(app) {
        this.mapControllers(app)
    }

    mapControllers(app) {
        let Controller, router, urlPath, bindControllerRoutes;
        router = express.Router();
        fs.readdirSync(path.join(__dirname, '../components')).forEach(function (component) {

            Controller = require(path.join(__dirname, '../components', component, component + 'Controller'));
            (component === 'Index') ? urlPath = "" : urlPath = component.toString().toLowerCase();
            app.use("/" + urlPath, router);
            bindControllerRoutes = new Controller(router, urlPath);
        });
    }
};