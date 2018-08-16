const BaseController = require('../../core/BaseController');
const User = require('./components/UsersModel');
const Sender = require('./../../helpers/sender/sender');
const Messages = require('./../../messages/messages');
module.exports = class UserController extends BaseController {

    constructor(router, basePath) {
        super(basePath);
        this.router = router;
        this.user = new User;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/:type/register', this.register.bind(this));
        this.router.patch('/:type/register', this.edit.bind(this));
        this.router.post('/change-password', this.changePassword.bind(this));
        this.router.get('/forget-password', this.requestForgetPassword.bind(this));
        this.router.post('/forget-password', this.changeForgetPassword.bind(this));
        this.router.get('/:id', this.getInfo.bind(this));
    }

    async getInfo(req, res) {
        let response = await this.user.getInfo(req.params.id);
        if (response.status) return res.send(response.data);
        else{
            if (response.error === 'user not found') return res.status(404).send(response.error);
            else res.status(400).send(response.error)
        }
    }

    async changeForgetPassword(req, res) {
        if (!req.session.forgetId) return res.status(404).send("Can not find your request, please try again.");
        if (!req.body.token) return res.status(400).send("Token must provide");
        if (!this.isValidPassword(req.body.password)) return res.status(400).send('new-password');
        let rs = await this.user.changeForgetPassword(req.session.forgetId, req.body.token, req.body.password);
        if (rs.status) {
            delete req.session.forgetId;
            return res.sendStatus(200);
        }
        else return res.status(400).send(rs.error)
    }

    async requestForgetPassword(req, res) {
        let rs = await this.user.requestForgetPassword(req.query.mode, req.query.value);
        if (rs.status) {
            Sender.SendSMS({to: [rs.phone], text: `${CommonMessages["forget-password"]["sms"]} ${rs.token}`});
            //Save user ID in session as "forgetId"
            req.session.forgetId = rs.id;
            return res.sendStatus(200);
        }
        else if (rs.error === "not-found") return res.status(404).send("User Not Found");
        else return res.status(400).send(rs.error)
    }

    async changePassword(req, res) {
        if (!this.isValidPassword(req.body.old)) return res.status(400).send('old-password');
        if (!this.isValidPassword(req.body.new)) return res.status(400).send('new-password');
        let id = req.session.userInfo._id;
        let rs = await this.user.changePassword(id, req.body.old, req.body.new);
        if (rs.status) return res.sendStatus(200);
        else if (rs.error === "not-found") return res.status(404).send("User Not Found");
        else return res.status(400).send(rs.error)
    }

    async edit(req, res) {
        let id = req.session.userInfo._id;
        let rs = await this.user.edit(req.params.type, id, JSON.stringify(req.body));
        if (rs.status) return res.sendStatus(200);
        else return res.status(400).send(rs.error)
    }

    async register(req, res) {
        if (!req.body.Phone || !this.isValidPhone(req.body.Phone)) return res.status(400).send('phone');
        if (!req.body.Password || !this.isValidPassword(req.body.Password)) return res.status(400).send('password');

        let rs = await this.user.register(req.params.type, req.body);

        if (rs.status) {
            Sender.SendSMS({
                to: [req.body.Phone],
                text: `${req.body.Firstname} ${Messages[req.params.type]["register-success"]["sms"]}`
            });
            return res.sendStatus(201);
        }
        else if (rs.error === "phone exists") return res.status(406).send("Phone exists in our system");
        else return res.status(400).send(rs.error)
    }

    isValidPhone(phone) {
        return phone.match(/^[0][9][0-9]{9}$/);
    }

    isValidPassword(password) {
        return ((password.length >= 4))
    }
};

