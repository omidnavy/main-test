const BaseController = require('../../core/BaseController');
const Client = require('./components/ClientModel');
const Sender = require('./../../helpers/sender/sender');
const Messages = require('./../../messages/client/messages');
module.exports = class UserController extends BaseController {

    constructor(router, basePath) {
        super(basePath);
        this.router = router;
        this.client = new Client;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/client/register', this.clientRegister.bind(this));
        this.router.patch('/client/register', this.edit.bind(this));
        this.router.post('/change-password', this.changePassword.bind(this));

    }

    async changePassword(req, res) {
        if (!this.isValidPassword(req.body.old)) return res.status(400).send('old-password');
        if (!this.isValidPassword(req.body.new)) return res.status(400).send('new-password');
        let id = req.session.userInfo._id;
        let rs = await this.client.changePassword(id, req.body.old, req.body.new);
        if (!!rs.status) return res.sendStatus(200);
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
            Sender.SendSMS({to: [user.Phone], text: `${user.Firstname} ${Messages["register-success"]["sms"]}`});
            return res.sendStatus(200);
        }
        else return res.status(400).send(rs.error)
    }

    isValidPhone(phone) {
        return (!!phone.match(/^[0][9][0-9]{9}$/));
    }

    isValidPassword(password) {
        return ((password.length >= 4))
    }
};

