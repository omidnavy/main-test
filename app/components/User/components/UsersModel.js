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
     * @param {string} id
     * @param {string} status
     * @returns {Promise<Object>}
     */
    activate(id,status) {
        return new Promise((resolve, reject) => {
            this.usersGateway.activate({id,status}, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (r.status) return resolve({status: true});
                    else return resolve({status: false, error: 'can not modify this user'});
                }
            })
        })
    }

    /**
     *
     * @param {string} id
     * @returns {Promise<Object>}
     */
    remove(id) {
        return new Promise((resolve, reject) => {
            this.usersGateway.remove({id}, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (r.status) return resolve({status: true});
                    else return resolve({status: false, error: 'can not remove this user'});
                }
            })
        })
    }

    /**
     *
     * @param {string} id
     * @returns {Promise<Object>}
     */
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
     * @param {string} type
     * @param {object} user
     * @returns {Promise<Object>}
     */
    register(type, user) {
        return new Promise((resolve, reject) => {
            user.Password = encryptPassword(user.Password);
            this.usersGateway.register({
                type,
                user: JSON.stringify(user)
            }, {deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)}, (e, r) => {
                if (e) {
                    logger('error', e);
                    return resolve({status: false, error: e})
                }
                else if (r) {
                    if (r.status) {
                        // if (type === 'client') {
                        //     fs.mkdirSync(uploadPath + '/' + r.msg);
                        // }
                        return resolve({status: true})
                    }
                    else return resolve({status: false, error: r.msg});
                }
            })
        })
    }


    /**
     *
     * @param {string} type
     * @param {string } _id
     * @param {object} user
     * @returns {Promise<Object>}
     */
    edit(type, _id, user) {
        return new Promise((resolve, reject) => {
            this.usersGateway.edit({
                type,
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


    /**
     *
     * @param {string }_id
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Promise<Object>}
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
     * @param mode
     * @param value
     * @returns {Promise<Object>}
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
     * @param {string} id
     * @param {string} token
     * @param {string} password
     * @returns {Promise<Object>}
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
                    if (!!r.status) return resolve({status: true});
                    else return resolve({status: false, error: r.msg});
                }
            })
        })
    }
};

