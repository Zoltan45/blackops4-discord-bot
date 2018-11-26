/**
 * @file playerDiscordPlatformLink.js
 * @author Lewey
 * @description post the data of players linked platform and username to elastic
 **/

const elasticsearch = require('elasticsearch');
const logger = require('../utils/logging.js');
const esconfig = require('../config/config');
const esclient = new elasticsearch.Client({
    host: esconfig.elasticsearch.host
});

/**
 * @param {Object} [userInfo] - JSON object of userdata to post
 **/

module.exports.post = async function (userInfo) {

    let esFormattedUserInfo = JSON.stringify(userInfo);

    if (!userInfo) { return logger('elasticsearch','No user info was passed into function')}

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

    if (!isESClusterUp) { return logger('elasticsearch','Cluster is not up, maybe my ip is not whitelisted')}

    //Send data to elastic
    const res = await esclient.index({
        index: 'discord-user-link',
        type: 'doc',
        id: userInfo.discord.user.id,
        body: esFormattedUserInfo
    });

    logger('elasticsearch', res)

};

/**
 * @param {Object} [userId] - Discord user id to search
 **/

module.exports.get = async function (userId) {

    return new Promise(async function (resolve, reject) {

        if (!userId) { return logger('elasticsearch','No userid was passed into function')}

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

        if (!isESClusterUp) { return logger('elasticsearch','Cluster is not up, maybe my ip is not whitelisted')}

        //Send data to elastic
        const res = await esclient.search({
            index: 'discord-user-link',
            q: `_id:${userId}`
        });

        logger('elasticsearch', res);

        if (res.hits.total === 0) {
            logger('discordlink', `user-not-linked | ${userId}`);
            resolve('user-not-linked')
        }

        resolve(JSON.stringify(res.hits.hits[0],null,4))

    });

};