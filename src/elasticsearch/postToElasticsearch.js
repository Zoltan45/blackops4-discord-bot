/**
 * @file postToElasticSearch.js
 * @author Lewey
 * @description post userdata to elasticsearch for data visualisation
 **/


const elasticsearch = require('elasticsearch');
const request = require('request');

const esconfig = require('../config/config');
const esclient = new elasticsearch.Client({
    host: esconfig.elasticsearch.host,
    log: 'trace'
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

    let userUsername = pStats.pUserName.replace('#', '-');

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

        if (!isESClusterUp) { return console.log('Cluster is not up')}

        let esUrl = esconfig.elasticsearch.host + '/' + gamemode + '/doc/' + userUsername;

        request({
            uri: esUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: esFormattedUserStats
        }, function (err, res, body) {
            if (err) return console.log(err);
            return console.log(res.body);
        })

    } else {
        return console.log('No valid game mode passed, valid modes: ' + bo4gamemodes)
    }



};

