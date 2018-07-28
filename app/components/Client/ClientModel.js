const BaseModel = require('../../core/BaseDBModel');
const Register = require('./components/RegisterDAL');
const UsersGateway = require('../../gateway/Users/Users');
const usersGateway = new UsersGateway;

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
                if (e) return reject(e);
                else if (r) return resolve(r)
            })
        })
    }


    //
    // createSession(user) {
    //     return crypto.createHash('sha256').update(`${user},${+new Date()},${salt}`).digest("base64")
    // }
    //
    // async storeSession(session, info) {
    //     info = JSON.stringify(info)
    //     return new Promise((resolve, reject) => {
    //         redis.hset("session", session, info, 'EX', '100', (e, r) => {
    //             if (e) return resolve(false)
    //             else resolve(true);
    //             this.query('INSERT INTO sessions (ID,Value) VALUES (?,?)',[session,info]);
    //         })
    //     })
    // }


};

