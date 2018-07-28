const BaseController = require('../../core/BaseController');
const Model = require('./ClientModel');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join(__dirname, '../../../uploads');

module.exports = class ClientController extends BaseController {

    constructor(router, basePath) {
        super(basePath);
        this.router = router;
        this.model = new Model;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/register', this.register.bind(this));
    }

    async register(req, res) {
        let user = {
            Username: req.body.username,
            Email: req.body.email,
            Phone: req.body.phone,
            Password: req.body.password,
            Firstname: req.body.firstname,
            Lastname: req.body.lastname
        };
        try {
            let rs = await this.model.register(user);
            if (!!rs.status) {
                fs.mkdirSync(uploadPath + '/' + rs.msg);
                return res.sendStatus(200)
            }
            else return res.status(400).send(rs.msg)
        }
        catch (e) {
            logger('error', e);
            res.sendStatus(400)
        }
    }


};

