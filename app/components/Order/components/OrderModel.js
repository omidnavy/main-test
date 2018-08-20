const BaseModel = require('../../../core/BaseModel');
const OrdersGateway = require('../../../gateway/Orders/Orders');
const ordersGateway = new OrdersGateway;

const path = require('path');
const fs = require('fs');
const uploadPath = path.join(__dirname, '../../../../uploads');

module.exports = class ClientModel extends BaseModel {

    constructor() {
        super();
        this.ordersGateway = ordersGateway.grpcClient;
    }

    getInfo(id) {
        return new Promise((resolve, reject) => {
            this.usersGateway.info({id}, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (r.status) return resolve({status: true, data: JSON.parse(r.msg)});
                    else return resolve({status: false, error: r.msg});
                }
            })
        })
    }

    /**
     *
     * @param {string} user
     * @param {string} type
     * @param {object} order
     * @returns {Promise} If true, User registered successfully
     */
    submit(user, type, order) {
        return new Promise((resolve, reject) => {
            this.ordersGateway.newOrder({
                user,
                type,
                order: JSON.stringify(order)
            }, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (r.status) return resolve({status: true,data:r.msg});
                    else return resolve({status: false, error: r.msg});
                }
            })
        })
    }

    remove(user,order){
        return new Promise((resolve, reject) => {
            this.ordersGateway.deleteOrder({
                user,
                order
            }, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (r.status) return resolve({status: true});
                    else return resolve({status: false});
                }
            })
        })
    }
};

