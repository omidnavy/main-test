const BaseController = require('../../core/BaseController');
const Model = require('./UserModel');

module.exports = class UserController extends BaseController {

    constructor(router, basePath) {
        super(basePath);
        this.model = new Model();
        this.router = router;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getUser.bind(this));
        this.router.get('/:id', this.getPage.bind(this));
    }

    getUser(req, res) {
        res.send({"users": ['a','b','c','x','y','z']});
    }

    getPage(req, res) {
        let newData = {"test": "some text",id:req.params.id};
        this.renderView(res, "./views/example", newData);
    }


};

