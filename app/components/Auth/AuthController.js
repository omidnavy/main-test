const BaseController = require('../../core/BaseController');
const Model = require('./AuthModel');
module.exports = class AuthController extends BaseController {

    constructor(router, basePath) {
        super(basePath);
        this.router = router;
        this.model = new Model;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/login', this.login.bind(this));
        this.router.delete('/login',this.logout.bind(this))
    }

    async login(req,res){
        let rs = await this.model.login(req.body.username,req.body.pass);
        if (rs) {
            req.session.isAuthenticate = true;
            req.session.userInfo = rs;
            res.sendStatus(200)
        }
        else res.sendStatus(403)
    }


    async logout(req,res){
        console.log(req.session.userInfo );
        req.session.destroy(()=>{
            res.sendStatus(200)
        })
    }


};

