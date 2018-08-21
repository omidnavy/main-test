const BaseController = require('../../core/BaseController');
const Order = require('./components/OrderModel');
const Sender = require('./../../helpers/sender/sender');
const Messages = require('./../../messages/messages');
const multiparty = require('multiparty')
    , request = require('request-promise-native')
    , fs = require('fs')
    , util = require('util');
module.exports = class OrderController extends BaseController {

    constructor(router, basePath) {
        super(basePath);
        this.router = router;
        this.order = new Order;
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/:type/new', this.upload.bind(this));
        this.router.get('/:id', this.getInfo.bind(this));
        this.router.post('/upload/:id', this.upload.bind(this));
    }

    async submit(req, res) {
        let rs = await this.order.submit(req.session.userInfo._id, req.params.type, req.body);
        if (rs.status) res.status(201).send(rs.data);
        else return res.status(400).send(rs.error)
    }

    async upload(req, res) {
        let form = new multiparty.Form();
        form.parse(req, async function (err, fields, files) {
            let rs = await this.order.submit(req.session.userInfo._id, req.params.type, fields);
            if (rs.status) {
                let error = false;
                for (let key in files) {
                    let formData = {
                        file: {
                            value: fs.createReadStream(files[key][0].path),
                            options: {filename: files[key][0].originalFilename}
                        }
                    };
                    // Post the file to the upload server
                    if (await request.post({
                        url: `http://localhost:4000/upload/${req.session.userInfo._id}/${rs.data}`,
                        formData: formData
                    }) !== 'success') {
                        error = true;
                        break
                    }
                    fs.unlinkSync(files[key][0].path)
                }
                if (error) {
                    await this.order.remove(req.session.userInfo._id, rs.data);
                    res.status(400).send('couldn\'t insert')
                }
                else {
                    Sender.SendSMS({
                        to: [req.session.userInfo.Phone],
                        text: `${req.session.userInfo.Firstname} ${Messages['client']["submit-success"]["sms"]}`
                    });
                    // Send Message to Operator also\
                    // Sender.SendSMS({
                    //     to: [req.session.userInfo.Phone],
                    //     text: `${req.session.userInfo.Firstname} ${Messages['client']["submit-success"]["sms"]}`
                    // });
                    res.status(201).send(rs.data);
                }
            }
            else res.status(400).send('bad')
        }.bind(this));

    }

    async getInfo(req, res) {
        let response = await this.order.getInfo(req.params.id);
        if (response.status) return res.send(response.data);
        else {
            if (response.error === 'user not found') return res.status(404).send(response.error);
            else res.status(400).send(response.error)
        }
    }

};

