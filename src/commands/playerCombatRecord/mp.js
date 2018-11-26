/**
 * @file mp.js
 * @author Lewey
 * @description build and format combat record for user
 **/

const getPlayerData = require('../../utils/getPlayerData');
const Discord = require('discord.js');
const images = require('../../config/imagesLinks.json');
const timeFormatter = require('../../utils/timeFormatter');
const postToElasticsearch = require('../../elasticsearch/postPlayerStats');
const logger = require('../../utils/logging');
const helpCommand = require('../help.js');

const playerDiscordPlatformLink = require('../../elasticsearch/playerDiscordPlatformLink.js');

/**
 * Main handler takes message and validates args
 *
 * @param {Object} [client] - Discord client Object
 * @param {Object} [message] - Discord message Object
 **/

module.exports = async function (message, client) {

    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let platform = args[0];
    let username = args.slice(1).join('%20');
    let userId = message.author.id;
    let allowedPlatforms = ["xbl","psn","pc"];

    if (args.length === 0) {

        let linkInfo = await playerDiscordPlatformLink.get(userId);
        linkInfo = JSON.parse(linkInfo);

        if (linkInfo === 'user-not-linked') {
            return message.reply(`You have not linked your profile`)
        }

        let platform = linkInfo._source.bo4.platform;
        let username = linkInfo._source.bo4.username;
        let formattedCombatRecord = await get(client,username,platform);

        message.delete();
        return message.reply(formattedCombatRecord)

    }

    if (args.length === 1) {

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

                    linkInfo = JSON.parse(linkInfo);

                    let platform = linkInfo._source.bo4.platform;
                    let username = linkInfo._source.bo4.username;

                    let formattedCombatRecord = await get(client,username,platform);
                    message.reply(formattedCombatRecord);
                    message.delete()
                })
                .catch(function (err) {
                    logger('discordlink', `The mentioned user with id ${possibleMentionedUser} does not exist`)
                })
        }

    }

    if (args.length === 2) {

        if (!username && !platform) {
            let helpEmbed = await helpCommand(client);
            return message.reply(helpEmbed)
        }

        if (allowedPlatforms.indexOf(platform) > -1 ) {

            let formattedCombatRecord = await get(client,username,platform);

            message.reply(formattedCombatRecord);
            message.delete()

        }

    }

};

/**
 * Use getPlayerData.js to retrieve users stats and format into Discord RichEmbed
 *
 * @param {Object} [client] - Discord client Object
 * @param {string} [username] - username to use in request
 * @param {string} [platform] - platform to use
 *
 * @return {Object} [RichEmbed] - formatted player combat record for multiplayer
 **/


async function get (client, username, platform) {

    return new Promise(async function (resolve, reject) {

        let userData = await getPlayerData.getPlayerData(username, platform, 'mp');

        //Stats
        let pTotalPlayTime      = timeFormatter.toHHMMSS(userData.data.mp.lifetime.all.timePlayedTotal);
        let pKills              = userData.data.mp.lifetime.all.kills;
        let pEKIA               = userData.data.mp.lifetime.all.ekia;
        let pAssists            = userData.data.mp.lifetime.all.assists;
        let pDeaths             = userData.data.mp.lifetime.all.deaths;
        let pEKIADRatio         = parseFloat(userData.data.mp.lifetime.all.ekiadRatio.toFixed(2));
        let pUserName           = userData.data.username;
        let pPlatform           = platform;
        let pCalculatedKills    = Math.ceil(parseInt(pEKIA-pAssists));
        let pCalculatedKDRatio  = parseFloat((pCalculatedKills/pDeaths).toFixed(2));
        let pWins               = userData.data.mp.lifetime.all.wins;
        let pLosses             = userData.data.mp.lifetime.all.losses;
        let pWLRatio            = parseFloat((pWins/pLosses).toFixed(2));
        let pWinstreak          = userData.data.mp.lifetime.all.curWinStreak;
        let pLevel              = userData.data.mp.level;
        let pPrestige           = Math.ceil(userData.data.mp.prestige);
        let pApiUrl             = `https://my.callofduty.com/api/papi-client/crm/cod/v2/title/bo4/platform/${platform}/gamer/${username}/profile/`;
        let pRawData            = userData.data.mp.lifetime.all;

        //Get correct icon for rank
        if (pPrestige === 0) {
            pIcon = images.multiplayer.noprestige[pLevel];
        } else {
            pIcon = images.multiplayer.prestige[pPrestige];
        }

        let pStats = {
            "pTotalPlayTime": pTotalPlayTime,
            "pKills": pKills,
            "pEKIA": pEKIA,
            "pAssists": pAssists,
            "pDeaths": pDeaths,
            "pEKIADRatio": pEKIADRatio,
            "pUserName": pUserName,
            "pPlatform": pPlatform,
            "pCalculatedKills": pCalculatedKills,
            "pCalculatedKDRatio": pCalculatedKDRatio,
            "pWins": pWins,
            "pLosses": pLosses,
            "pWLRatio": pWLRatio,
            "pWinstreak": pWinstreak,
            "pLevel": pLevel,
            "pPrestige": pPrestige,
            "pIcon": pIcon,
            "pApiUrl": pApiUrl,
            "pRawData": pRawData
        };

        //send to elasticsearch cluster
        postToElasticsearch('multiplayer', pStats);

        let formattedCombatRecord = await formPlayerRichEmbed(client,pStats);

        resolve(formattedCombatRecord);

    });

}

/**
 * Use getPlayerData.js to retrieve users stats and format into Discord RichEmbed
 *
 * @param {Object} [client] - Discord client Object
 * @param {Object} [pStats] - JSON object of user stats from get()
 *
 * @return {Object} [RichEmbed] - formatted time
 **/

function formPlayerRichEmbed (client, pStats) {

    return new Promise(function (resolve, reject) {

        let rEmbed = '';

        let platformThumb = images.platform[pStats.pPlatform];

        if (pStats.pPrestige === 11) {
            pStats.pPrestige = 'Master';
        }

        if (pStats.pPrestige === 0) {

            rEmbed = new Discord.RichEmbed()
                .setTitle('Multiplayer Combat Record')
                .setThumbnail(platformThumb)
                .addField('Username', pStats.pUserName,true)
                .addField('Platform', pStats.pPlatform,true)
                .addField('Time Played', pStats.pTotalPlayTime,true)
                .addBlankField()
                .addField('Game Stats', 'Stats straight from game')
                .addField('EKIA', pStats.pEKIA, true)
                .addField('Deaths', pStats.pDeaths, true)
                .addField('EKIA Ratio', pStats.pEKIADRatio)
                .addField('Wins', pStats.pWins,true)
                .addField('Losses', pStats.pLosses,true)
                .addField('W/L Ratio',pStats.pWLRatio,true)
                .addField('Current Winstreak', pStats.pWinstreak)
                .addBlankField()
                .addField('Calculated Stats', 'Kills are calculated by subtracting assists from EKIAs')
                .addField('Kills', pStats.pCalculatedKills, true)
                .addField('Deaths', pStats.pDeaths, true)
                .addField('K/D Ratio', pStats.pCalculatedKDRatio)
                .addBlankField()
                .addField('Level', pStats.pLevel, true)
                .setColor('#ff7d00')
                .setImage(pStats.pIcon)
                .setFooter('Developed by @Lewey#6767')
                .setAuthor(client.user.username, client.user.avatarURL);

        } else {

            rEmbed = new Discord.RichEmbed()
                .setTitle('Multiplayer Combat Record')
                .setThumbnail(platformThumb)
                .addField('Username', pStats.pUserName,true)
                .addField('Platform', pStats.pPlatform,true)
                .addField('Time Played', pStats.pTotalPlayTime,true)
                .addBlankField()
                .addField('Game Stats', 'Stats straight from game')
                .addField('EKIA', pStats.pEKIA, true)
                .addField('Deaths', pStats.pDeaths, true)
                .addField('EKIA Ratio', pStats.pEKIADRatio)
                .addField('Wins', pStats.pWins,true)
                .addField('Losses', pStats.pLosses,true)
                .addField('W/L Ratio',pStats.pWLRatio,true)
                .addField('Current Winstreak', pStats.pWinstreak)
                .addBlankField()
                .addField('Calculated Stats', 'More accurate stats removing assists from K/D etc')
                .addField('Kills', pStats.pCalculatedKills, true)
                .addField('Deaths', pStats.pDeaths, true)
                .addField('K/D Ratio', pStats.pCalculatedKDRatio)
                .addBlankField()
                .addField('Prestige', pStats.pPrestige, true)
                .addField('Level', pStats.pLevel, true)
                .setColor('#ff7d00')
                .setImage(pStats.pIcon)
                .setFooter('Developed by @Lewey#6767')
                .setAuthor(client.user.username, client.user.avatarURL);
        }

        resolve(rEmbed)

    });
}
