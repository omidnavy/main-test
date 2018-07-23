const BaseModel = require('../../core/BaseDBModel');
const Login = require('./components/LoginDAL');
const crypto = require('crypto');



module.exports = class AuthModel extends BaseModel {

    constructor() {
        super();
        this.Login = new Login;


        // redis.hget('session','ihyVnRicvvJZkNwGgsAnKHlJrxw5nLt69Vqms4njPBQ=',(e,r)=>{
        //     console.log(r)
        // })
    }

    async login(username, password) {
        let isValid = await this.Login.checkDB(username, this.encryptPassword(password));
        if (isValid) {
            return isValid
        }
        else return (false)

    }


    ////

    encryptPassword(password) {
        return crypto.createHash('sha256').update(password).digest("base64");
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

