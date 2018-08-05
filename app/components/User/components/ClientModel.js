const BaseModel = require('../../../core/BaseModel');
const UsersGateway = require('../../../gateway/Users/Users');
const usersGateway = new UsersGateway;

const path = require('path');
const fs = require('fs');
const uploadPath = path.join(__dirname, '../ ../../../uploads');

module.exports = class ClientModel extends BaseModel {

    constructor() {
        super();
        this.usersGateway = usersGateway.grpcClient;
    }

    /**
     *
     * @param {object} user
     * @returns {Promise} If true, User registered successfully
     */
    register(user) {
        return new Promise((resolve, reject) => {
            user.Password = encryptPassword(user.Password);
            this.usersGateway.registerClient(user, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (!!r.status) {
                        fs.mkdirSync(uploadPath + '/' + r.msg);
                        return resolve({status: true})
                    }
                    else return resolve({status: false, error: r.msg});
                }
            })
        })
    }


    /**
     *
     * @param {string }_id
     * @param {object} user
     * @returns {Promise} If true, User registered successfully
     */
    edit(_id, user) {
        return new Promise((resolve, reject) => {
            this.usersGateway.editClient({
                _id,
                user
            }, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (!!r.status) return resolve({status: true});
                    else return resolve({status: false, error: r.msg});
                }
            })
        })
    }

};

