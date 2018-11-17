/**
 * @file timeFormatter.js
 * @author Lewey
 * @description format seconds to DD.HH.MM
 **/

/**
 * @param {number} [inputseconds] - username to use in request
 * @return {string} [timeplayed] - formatted time
 **/
function toHHMMSS (inputseconds) {

    let seconds = parseInt(inputseconds, 10);

    let days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    let hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    let mnts = Math.floor(seconds / 60);
    seconds  -= mnts*60;

    return days+"d "+hrs+"h "+mnts+"m"
}

module.exports.toHHMMSS = (inputseconds) => toHHMMSS(inputseconds);
