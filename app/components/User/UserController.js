const BaseController = require('../../core/BaseController');
const Client = require('./components/ClientModel');
const User = require('./components/UsersModel');
const Sender = require('./../../helpers/sender/sender');
const ClientMessages = require('./../../messages/client/messages');
const CommonMessages = require('./../../messages/messages');
module.exports = class UserController extends BaseController {

    constructor(router, basePath) {
        super(basePath);
        this.router = router;
        this.client = new Client;
        this.user = new User;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/client/register', this.clientRegister.bind(this));
        this.router.patch('/client/register', this.edit.bind(this));
        this.router.post('/change-password', this.changePassword.bind(this));
        this.router.post('/forget-password/request', this.requestForgetPassword.bind(this));
        this.router.post('/forget-password/change', this.changeForgetPassword.bind(this));

    }

    async changeForgetPassword(req, res) {
        console.log(req.session)
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
        let rs = await this.user.requestForgetPassword(req.body.mode, req.body.value);
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
        if (!!rs.status) return res.sendStatus(200);
        else if (rs.error === "not-found") return res.status(404).send("User Not Found");
        else return res.status(400).send(rs.error)
    }

    async edit(req, res) {
        let id = req.session.userInfo._id;
        let rs = await this.client.edit(id, JSON.stringify(req.body));
        if (!!rs.status) return res.sendStatus(200);
        else return res.status(400).send(rs.error)
    }

    async clientRegister(req, res) {
        if (!this.isValidPhone(req.body.Phone)) return res.status(400).send('phone');
        if (!this.isValidPassword(req.body.Password)) return res.status(400).send('password');

        let user = {
            Email: req.body.Email,
            Phone: req.body.Phone,
            Password: req.body.Password,
            Firstname: req.body.Firstname,
            Lastname: req.body.Lastname
        };

        let rs = await this.client.register(user);
        if (!!rs.status) {
            Sender.SendSMS({to: [user.Phone], text: `${user.Firstname} ${ClientMessages["register-success"]["sms"]}`});
            return res.sendStatus(201);
        }
        else if (rs.error === "phone exists") return res.status(406).send("Phone exists in our system");
        else return res.status(400).send(rs.error)
    }

    isValidPhone(phone) {
        return (!!phone.match(/^[0][9][0-9]{9}$/));
    }

    isValidPassword(password) {
        return ((password.length >= 4))
    }
};

