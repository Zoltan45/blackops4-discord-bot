/**
 * @file link.js
 * @author Lewey
 * @description link the users discord id to a platform and
 **/

//const Discord = require('discord.js');
const playerDiscordPlatformLink = require('../elasticsearch/playerDiscordPlatformLink.js');
const helpCommand = require('./help.js');
const logger = require('../utils/logging');

/**
 * @param {Object} [message] - discord message object
 * @param {Object} [client] - discord client
 **/

module.exports = async function (message, client) {

    if (!message) return;

    let args = message.content.trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    let discordUserId = message.author.id.toString();
    let discordUserNick = message.author.username;
    let discordUserDiscriminator = message.author.discriminator;
    let discordserverID = message.channel.guild.id.toString();
    let discordserverName = message.channel.guild.name;

    let bo4platform = args[0];
    let bo4Username = args.slice(1).join(' ');
    let allowedPlatforms = ["xbl","psn","pc"];

    if (args.length === 0 || allowedPlatforms.indexOf(bo4platform) === -1 || !bo4Username) {

        message.reply("Invalid Args");
        let helpEmbed = await helpCommand(client);
        return message.reply(helpEmbed)

    }

    let userInfo = {
        "discord": {
            "user": {
                "id": discordUserId,
                "nick": discordUserNick,
                "discriminator": discordUserDiscriminator
            },
            "server": {
                "id": discordserverID,
                "name": discordserverName,
            }
        },
        "bo4": {
            "platform": bo4platform,
            "username": bo4Username
        }
    };

    //link the discord user with platform and username
    playerDiscordPlatformLink.post(userInfo);

    message.reply(`User ${discordUserNick} has been linked to ${bo4Username} on ${bo4platform}`);
    logger('discordlink', `User ${discordUserNick} has been linked to ${bo4Username} on ${bo4platform}`)

};