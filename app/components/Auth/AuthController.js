const BaseController = require('../../core/BaseController');
const Model = require('./components/AuthModel');
module.exports = class AuthController extends BaseController {

    constructor(router, basePath) {
        super(basePath);
        this.router = router;
        this.model = new Model;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/login', this.login.bind(this));
        this.router.delete('/login', this.logout.bind(this))
    }

    async login(req, res) {
        try {
            let rs = await this.model.login(req.body.username, req.body.password);
            if (rs.status) {
                req.session.isAuthenticate = true;
                req.session.userInfo = rs.user;
                return res.sendStatus(200)
            }
            else return res.sendStatus(403)
        }
        catch (e) {
            logger('error',e);
            return res.sendStatus(403)
        }

    }

    async logout(req, res) {
        return req.session.destroy(() => {
            res.sendStatus(200)
        })
    }


};

