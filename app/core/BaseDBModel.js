/*
Simple MYSQL DB Class using pools and basic query function.
you can extend this class as you need or change it to another DB
 */

const argv = require('minimist')(process.argv.slice(2));
const env = argv.enviroment || 'home';
const mysql = require('mysql');
const config = require('./config/database')[env];
const BaseModel = require('./BaseModel');

const createPool = () => {
    let pool = mysql.createPool({...config, ...{connectionLimit: 10, supportBigNumbers: true}});
    if (pool) {
        pool.on('error', (e) => {
            reconnect()
        });
        return pool
    }
};

const getConnection = (callback) => {
    pool.getConnection((e, connection) => {
        if (e) {
            logger('error', e);
            reconnect();
            return callback(true)
        }
        connection.on('error', onConnectionError);
        return callback(false, connection);
    })
};

const onConnectionError = (e) => {
    logger('error', e);
};

const reconnect = () => {
    pool.end(() => {
        pool = createPool()
    })
};
let pool = createPool();

module.exports = class BaseDBModel extends BaseModel {
    constructor() {
        super()
    }

    /**
     *
     * @param {string} query
     * @param items
     * @returns {Promise<any>}
     */
    query(query, items) {
        return new Promise((resolve, reject) => {
            if (typeof items === 'undefined') {
                items = false;
            }
            getConnection((e, connection) => {
                if (e) {
                    return resolve(false)
                }
                let q = connection.query(query, items, (e, results) => {
                    connection.removeListener('error',onConnectionError);
                    connection.release();
                    if (e) {
                        logger('error', e);
                        logger('info', q.sql);
                        return resolve(false)
                    }
                    return resolve(results)
                })
            })
        })
    }


};