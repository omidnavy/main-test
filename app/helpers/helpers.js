const crypto = require('crypto');
const winston = require('./winston/winston');
logger = winston.logger; //Or you can use static functions

grpcTimeout = 10; //seconds for grpc reply timeout


encryptPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest("base64");
}