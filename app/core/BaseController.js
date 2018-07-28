const path = require('path')
module.exports = class BaseController {
    constructor(basePath) {
        this.basePath = basePath.length > 0 ? basePath + '/' : basePath + '/index/';
    }

    renderView(response, viewName, data = {}) {
        let viewPath = this.basePath + viewName;
        response.render(path.join( __dirname, '../components/' + viewPath ), data);
    }

};