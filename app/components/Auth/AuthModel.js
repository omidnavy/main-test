const BaseModel = require('../../core/BaseDBModel');
const UsersGateway = require('../../gateway/Users/Users');
const usersGateway = new UsersGateway;

module.exports = class AuthModel extends BaseModel {
    constructor() {
        super();
        this.usersGateway = usersGateway.grpcClient;
    }

    login(username, password) {
        return new Promise((resolve,reject)=>{
            this.usersGateway.checkLogin({username:username,password:encryptPassword(password)},{deadline: new Date().setSeconds(new Date().getSeconds() + grpcTimeout)},(e,r)=>{
                if (e) return reject(e);
                else if (r) return resolve(r)
            })
        })
    }
};

