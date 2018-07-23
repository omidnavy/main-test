const BaseModel = require('../../../core/BaseDBModel');
module.exports = class LoginDAL extends BaseModel {

    constructor() {
        super();
    }

    async checkDB(user, pass) {
        let rsp = await this.query('SELECT ID,Role,RoleID,Firstname,Lastname,Email,Phone FROM Users WHERE Username = ? AND Password = ?', [user, pass]);
        if (rsp) {
            if (rsp.length > 0) return (rsp);
            else return (false)
        }
        else return (false)
    }



};

