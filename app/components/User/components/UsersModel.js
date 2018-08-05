const BaseModel = require('../../../core/BaseModel');
const UsersGateway = require('../../../gateway/Users/Users');
const usersGateway = new UsersGateway;

module.exports = class ClientModel extends BaseModel {

    constructor() {
        super();
        this.usersGateway = usersGateway.grpcClient;
    }

    /**
     *
     * @param {string }_id
     * @param oldPassword
     * @param newPassword
     * @returns {Promise} If true, User registered successfully
     */
    changePassword(_id, oldPassword, newPassword) {
        oldPassword = encryptPassword(oldPassword);
        newPassword = encryptPassword(newPassword);
        return new Promise((resolve, reject) => {
            this.usersGateway.changePassword({
                _id,
                oldPassword,
                newPassword
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

    /**
     *
     * @returns {Promise} If true, User reques successfully
     * @param mode
     * @param value
     */
    requestForgetPassword(mode, value) {
        return new Promise((resolve, reject) => {
            if ((!mode) || !value) return resolve({status: false, error: 'bad-request'});
            this.usersGateway.forgetPasswordRequest({
                mode,
                value
            }, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (!!r.status) return resolve(r);
                    else return resolve({status: false, error: r.msg});
                }
            })
        })
    }

    /**
     *
     * @returns {Promise} If true, User reques successfully
     * @param id
     * @param token
     * @param password
     */
    changeForgetPassword(id, token, password) {
        password = encryptPassword(password);

        return new Promise((resolve, reject) => {
            this.usersGateway.forgetPasswordChange({
                id,
                token,
                password
            }, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (!!r.status) return resolve({status:true});
                    else return resolve({status: false, error: r.msg});
                }
            })
        })
    }
};

