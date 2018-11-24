/**
 * @file postPlayerStats.js
 * @author Lewey
 * @description post userdata to elasticsearch for data visualisation
 **/

const elasticsearch = require('elasticsearch');
const logger = require('../utils/logging.js');
const esconfig = require('../config/config');
const esclient = new elasticsearch.Client({
    host: esconfig.elasticsearch.host
});

/**
 *
 * @param {string} [gamemode] - gamemode {multiplayer|zombies|blackout}
 * @param {Object} [pStats] - platform to use
 *
 **/


module.exports = async function (gamemode, pStats) {

    let esFormattedUserStats = JSON.stringify(pStats);
    let bo4gamemodes = ["multiplayer","zombies","blackout"];

    if (!gamemode) { return console.log('No Index/gamemode was selected, {valid modes: ' + bo4gamemodes)}
    if (!pStats) { return console.log('No userstats were passed as a parameter')}

    let userUsername = pStats.pUserName.replace('#', '-').toLowerCase();

    if (bo4gamemodes.indexOf(gamemode) > -1 ) {

        let isESClusterUp = await new Promise(function (resolve, reject) {
            esclient.ping({
                requestTimeout: 1000
            }, function (error) {
                if (error) {
                    reject(false)
                } else {
                    resolve(true)
                }
            });
        });

        if (!isESClusterUp) { return console.error('Cluster is not up, maybe my ip is not whitelisted')}

        //Send data to elastic
        const res = await esclient.index({
            index: gamemode,
            type: 'doc',
            id: userUsername,
            body: esFormattedUserStats
        });

        logger('elasticsearch','/' + gamemode + '/doc/' + userUsername);
        logger('elasticsearch', res)


    } else {
        return console.log('No valid game mode passed, valid modes: ' + bo4gamemodes)
    }



};

