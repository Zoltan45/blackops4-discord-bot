/**
 * @file getPlayerData.js
 * @author Lewey
 * @description make api request and retrieve userdata
 **/

const request = require('request');
const logger = require('./logging.js');

/**
 * @param {string} [username] - username to use in request
 * @param {string} [platform] - platform to be searched - psn,xbl,battle
 * @param {string} [type] - {zombies|mp(multiplayer)|blackout}

 * @return {JSON} [userdata] - userdata
 **/

function getPlayerData (username, platform, type) {

    if (platform === 'pc') {
        username = username.replace('#', '%23');
        platform = 'battle'
    }
    if (platform === 'xbl') {
        username = username.replace(' ', '%20');
    }

    return new Promise(function (resolve, reject) {

        let ApiUrl = `https://my.callofduty.com/api/papi-client/crm/cod/v2/title/bo4/platform/${platform}/gamer/${username}/profile/type/${type}`;

        logger('request', ApiUrl);

        request({
            uri: ApiUrl,
            method: 'GET'
        }, function (err, res, body) {
            if (err) logger('request', err);
            if (!res.statusCode === 200) logger('request', err);

            let parsedBody = JSON.parse(body);

            if (parsedBody.status === 'error') {
                logger('request', `${username} | ${type} | ${platform} | ${JSON.stringify(body)}`);
            } else {
                resolve(parsedBody);
                logger('request', `${username} | ${type} | ${platform}` );
            }

        })

    });

}

module.exports.getPlayerData = (battleNetId,platform,type) => getPlayerData(battleNetId,platform,type);

