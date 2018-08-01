const {fork} = require('child_process');
const path = require('path');
let forked = spawn();

forked.on('exit',()=>{
    setTimeout(()=>{forked = spawn()},5000)
});
forked.on('error',()=>{
    setTimeout(()=>{forked = spawn()},5000)
});

function spawn(){
    return fork(path.join(__dirname,'../../core/child-process','SendSMS.js'))
}

module.exports = class sender {
    /**
     *  Log within another process.
     * @param args
     */
    static SendSMS(args){
        forked.send(args)
    }

};