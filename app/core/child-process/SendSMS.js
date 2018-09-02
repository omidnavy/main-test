const qs = require("querystring");
const http = require("http");
const options = {
    "method": "POST",
    "hostname": "rest.payamak-panel.com",
    "port": null,
    "path": "/api/SendSMS/SendSMS",
    "headers": {
        "cache-control": "no-cache",
        "postman-token": "986f8677-6806-fd9c-62bf-5b7594a44066",
        "content-type": "application/x-www-form-urlencoded"
    }
};

/**
 *
 * @param args
 * @param username
 * @param password
 * @constructor
 */
SendSms = function (args, username = 'cafetarjome', password = 'Cafe!1operator') {
    let req = http.request(options, function (res) {
        let chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            let body = Buffer.concat(chunks);
        });
    });
    req.write(qs.stringify({
        username: "xxxcafetarjome",
        password: "Cafe!1operator",
        to: args.to.join(','),
        from: "50005000900012",
        text: args.text,
        isflash: 'false'
    }));
    req.end();
};


process.on('message', (args) => {
    SendSms(args)
});