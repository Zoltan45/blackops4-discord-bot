/**
 * @file profile.js
 * @author Lewey
 * @description handle user profile command
 **/

//const Discord = require('discord.js');
const playerDiscordPlatformLink = require('../elasticsearch/playerDiscordPlatformLink.js');
const logger = require('../utils/logging');
const images = require('../config/imagesLinks.json');
const Discord = require('discord.js');

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

        if (linkInfo === 'user-not-linked') {
            return message.reply(`You have not linked your profile`)
        }

        let playerProfile = await formProfileRichEmbed(client, linkInfo);
        message.reply(playerProfile);
        message.delete()

    } else {

        let possibleMentionedUser = args[0].replace(/[^a-zA-Z0-9 ]/g, '');

        if (!isNaN(possibleMentionedUser) && possibleMentionedUser.length === 18) {

            //we have a user id now lets verify it
            client.fetchUser(possibleMentionedUser)
                .then(async function () {
                    // it was a real user
                    let linkInfo = await playerDiscordPlatformLink.get(possibleMentionedUser);

                    if (linkInfo === 'user-not-linked') {
                        return message.reply(`<@!${possibleMentionedUser}> does not have a linked profile`)
                    }

                    let playerProfile = await formProfileRichEmbed(client, linkInfo);
                    message.reply(playerProfile);
                    message.delete()
                })
                .catch(function (err) {
                    logger('discordlink', `The mentioned user with id ${possibleMentionedUser} does not exist`)
                })
        }

    }

};

function formProfileRichEmbed (client, linkInfo) {

    return new Promise(function (resolve, reject) {

        let rEmbed = '';

        linkInfo = JSON.parse(linkInfo);

        let discordusername = linkInfo._source.discord.user.nick;
        let bo4platform = linkInfo._source.bo4.platform;
        let bo4username = linkInfo._source.bo4.username;

        let platformThumb = images.platform[bo4platform];

        rEmbed = new Discord.RichEmbed()
            .setTitle(`${discordusername}'s Profile`)
            .setThumbnail(platformThumb)
            .addField('Username', bo4username ,true)
            .addField('Platform', bo4platform ,true)
            .setColor('#0000f1')
            .setFooter('Developed by @Lewey#6767')
            .setAuthor(client.user.username, client.user.avatarURL);

        resolve(rEmbed)

    });
}
