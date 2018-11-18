/**
 * @file getPlayerData.js.js
 * @author Lewey
 * @description make api request and retrieve userdata
 **/

const request = require('request');

/**
 * @param {string} [username] - username to use in request
 * @param {string} [platform] - platform to be searched - psn,xbl,battle
 * @return {JSON} [userdata] - userdata
 **/

function getPlayerData (username, platform) {

    return new Promise(function (resolve, reject) {

        let ApiUrl = `https://my.callofduty.com/api/papi-client/crm/cod/v2/title/bo4/platform/${platform}/gamer/${username}/profile/`;

        request({
            uri: ApiUrl,
            method: 'GET'
        }, function (err, res, body) {
            if (err) reject(err);
            if (!res.statusCode === 200) reject(err);

            let parsedBody = JSON.parse(body);

            if (parsedBody.status === 'error') {
                reject(JSON.stringify(body))
            } else {
                resolve(parsedBody);
            }

        })

    });

}

module.exports.getPlayerData = (battleNetId,platform) => getPlayerData(battleNetId,platform);
