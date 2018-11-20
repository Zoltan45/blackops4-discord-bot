/**
 * @file zombiesCombatRecord.js
 * @author Lewey
 * @description build and format combat record for user
 **/

const getPlayerData = require('../../utils/getPlayerData');
const Discord = require('discord.js');
const images = require('../../config/imagesLinks.json');
const timeFormatter = require('../../utils/timeFormatter');
const postToElasticsearch = require('../../elasticsearch/postToElasticsearch');

/**
 * Use getPlayerData.js to retrieve users stats and format into Discord RichEmbed
 *
 * @param {Object} [client] - Discord client Object
 * @param {string} [username] - username to use in request
 * @param {string} [platform] - platform to use
 *
 * @return {Object} [RichEmbed] - formatted player combat record for zombies
 **/

async function get (client, username, platform) {

    return new Promise(function (resolve, reject) {

        //format platform usernames
        if (platform === 'battle') {
            username = username.replace('#', '%23');
        }
        if (platform === 'xbl') {
            username = username.replace(' ', '%20');
        }

        getPlayerData.getPlayerData(username, platform, 'zombies')
            .then(async function (userData) {

                //Stats
                let pUserName               = userData.data.username;
                let pPlatform               = platform;
                let pTotalPlayTime          = timeFormatter.toHHMMSS(userData.data.mp.lifetime.all.timePlayedTotal);
                let pKills                  = userData.data.mp.lifetime.all.kills;
                let pDeaths                 = userData.data.mp.lifetime.all.deaths;
                let pHeadshots              = userData.data.mp.lifetime.all.headshots;
                let pTotalDowns             = userData.data.mp.lifetime.all.totalDowns;
                let pTotalRoundsSurvived    = userData.data.mp.lifetime.all.totalRoundsSurvived;
                let pHighestRound           = userData.data.mp.lifetime.all.highestRoundReached;
                let pLevel                  = userData.data.mp.level;
                let pPrestige               = Math.ceil(userData.data.mp.prestige);
                let pApiUrl                 = `https://my.callofduty.com/api/papi-client/crm/cod/v2/title/bo4/platform/${platform}/gamer/${username}/profile/`;
                let pRawData                = userData.data.mp.lifetime.all;

                //Get correct icon for rank
                // TODO Get icons for zombies
                if (pPrestige === 0) {
                    pIcon = images.zombies.noprestige[pLevel];
                } else {
                    pIcon = images.zombies.prestige[pPrestige];
                }

                let pStats = {
                    "pUserName": pUserName,
                    "pPlatform": pPlatform,
                    "pTotalPlayTime": pTotalPlayTime,
                    "pKills": pKills,
                    "pDeaths": pDeaths,
                    "pHeadshots": pHeadshots,
                    "pTotalDowns": pTotalDowns,
                    "pTotalRoundsSurvived": pTotalRoundsSurvived,
                    "pHighestRound": pHighestRound,
                    "pLevel": pLevel,
                    "pPrestige": pPrestige,
                    "pIcon": pIcon,
                    "pApiUrl": pApiUrl,
                    "pRawData": pRawData
                };

                //send to elasticsearch cluster
                postToElasticsearch('zombies', pStats);

                let formattedCombatRecord = await formPlayerRichEmbed(client,pStats);

                resolve(formattedCombatRecord);

            })
            .catch(function (err) {

                reject(err)

            });

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
                .setTitle('Zombies Combat Record')
                .setThumbnail(platformThumb)
                .addField('Username', pStats.pUserName,true)
                .addField('Platform', pStats.pPlatform,true)
                .addField('Time Played', pStats.pTotalPlayTime,true)
                .addBlankField()
                .addField('Game Stats', 'Stats straight from game')
                .addField('Kills', pStats.pKills, true)
                .addField('Deaths', pStats.pDeaths, true)
                .addField('Headshots', pStats.pHeadshots)
                .addField('Total Downs', pStats.pTotalDowns,true)
                .addField('Rounds Survived', pStats.pTotalRoundsSurvived,true)
                .addField('Highest Round', pStats.pHighestRound,true)
                .addBlankField()
                .addField('Level', pStats.pLevel, true)
                .setColor('#ff7d00')
                .setImage(pStats.pIcon)
                .setFooter('Developed by @Lewey#6767')
                .setAuthor(client.user.username, client.user.avatarURL);

        } else {

            rEmbed = new Discord.RichEmbed()
                .setTitle('Zombies Combat Record')
                .setThumbnail(platformThumb)
                .addField('Username', pStats.pUserName,true)
                .addField('Platform', pStats.pPlatform,true)
                .addField('Time Played', pStats.pTotalPlayTime,true)
                .addBlankField()
                .addField('Game Stats', 'Stats straight from game')
                .addField('Kills', pStats.pKills, true)
                .addField('Deaths', pStats.pDeaths, true)
                .addField('Headshots', pStats.pHeadshots)
                .addField('Total Downs', pStats.pTotalDowns,true)
                .addField('Rounds Survived', pStats.pTotalRoundsSurvived,true)
                .addField('Highest Round', pStats.pHighestRound,true)
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

module.exports.get = (client, username, platform) => get(client, username, platform);
