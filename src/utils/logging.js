/**
 * @file logging.js
 * @author Lewey
 * @description what do you think it does
 **/

const fs = require('fs');
const config = require('../config/config.json');

module.exports = function (type, stufftolog) {

    let loggingDir = config.logdir || './logs';

    //create data log dir
    if (!fs.existsSync(loggingDir)){
        fs.mkdirSync(loggingDir);
    }

    switch(type) {
        case 'elasticsearch':
            logfilename = "elasticsearch";
            break;
        case 'request':
            logfilename = "request";
            break;
        case 'discordlink':
            logfilename = "discordlink";
            break;
        case 'guild':
            logfilename = "guild";
            break;
        case 'dbl':
            logfilename = "dbl";
            break;
    }

    let options = {
        errorEventName:'error',
        logDirectory: loggingDir,
        fileNamePattern:`${logfilename}-<DATE>.log`,
        dateFormat:'DD.MM.YYYY'
    };

    const log = require('simple-node-logger').createRollingFileLogger(options);

    log.info(stufftolog)
};