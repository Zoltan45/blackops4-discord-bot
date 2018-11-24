/**
 * @file profile.js
 * @author Lewey
 * @description handle user profile command
 **/

//const Discord = require('discord.js');
const playerDiscordPlatformLink = require('../elasticsearch/playerDiscordPlatformLink.js');
const logger = require('../utils/logging');
const multiplayerCombatRecord = require('./playerCombatRecord/multiplayerCombatRecord');


/**
 * @param {Object} [message] - discord message object
 * @param {Object} [client] - discord client
 **/
module.exports = async function (message, client) {

    if (!message) return;

    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let userId = message.author.id;

    //check self if no args passed
    if (args.length === 0) {

        let linkInfo = await playerDiscordPlatformLink.get(userId);
        linkInfo = JSON.parse(linkInfo);

        let platform = linkInfo._source.bo4.platform;
        let username = linkInfo._source.bo4.username;
        let formattedCombatRecord = await multiplayerCombatRecord.get(client,username,platform);

        message.reply(formattedCombatRecord);
        message.delete()

    } else {

        let possibleMentionedUser = args[0].replace(/[^a-zA-Z0-9 ]/g, '');

        if (!isNaN(possibleMentionedUser) && possibleMentionedUser.length === 18) {

            //we have a user id now lets verify it
            client.fetchUser(possibleMentionedUser)
                .then(async function () {
                    // it was a real user
                    let linkInfo = await playerDiscordPlatformLink.get(possibleMentionedUser);
                    linkInfo = JSON.parse(linkInfo);

                    let platform = linkInfo._source.bo4.platform;
                    let username = linkInfo._source.bo4.username;

                    let formattedCombatRecord = await multiplayerCombatRecord.get(client,username,platform);
                    message.reply(formattedCombatRecord);
                    message.delete()
                })
                .catch(function (err) {
                    logger('discordlink', `The mentioned user with id ${possibleMentionedUser} does not exist`)
                })
        }

    }

};