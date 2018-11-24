/**
 * @file bot.js
 * @author Lewey
 * @description main bot file
 **/

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config/config.json');

//****
// Custom functions
const multiplayerCombatRecord = require('./commands/playerCombatRecord/multiplayerCombatRecord');
const zombiesCombatRecord = require('./commands/playerCombatRecord/zombiesCombatRecord');
const blackoutCombatRecord = require('./commands/playerCombatRecord/blackoutCombatRecord');

const helpCommand = require('./commands/help.js');
const profileCommand = require('./commands/profile.js');
const linkCommand = require('./commands/link.js');

//
//****

client.on("ready", () => {
    console.log(`${client.user.username} is online`);
    client.user.setActivity(`${client.guilds.size} Servers | ${client.users.size} Users | ${config.prefix}help`, { type: 'WATCHING' });
});

client.on("message", async message => {

    // update activity on every new message
    client.user.setActivity(`${client.guilds.size} Servers | ${client.users.size} Users | ${config.prefix}help`, { type: 'WATCHING' });

    if (message.author.bot) return;

    //get servers config
    let serverID = message.channel.guild.id;
    let serverName = message.channel.guild.name;

    let messageAuthourName = message.author.username;
    let messageAuthourId = message.author.id;

    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const isAdmin = message.member.hasPermission('ADMINISTRATOR');
    const isOwner = config.owners.indexOf(messageAuthourId) > -1;
    const hasManageMessagePermissions = message.guild.me.hasPermission('MANAGE_MESSAGES');
    const isBlacklisted = config.blacklist.indexOf(serverID) > -1;

    //Checks if server in backlist;
    if (isBlacklisted) return;

    //Dont do any thing if the bot doesn't have perms
    if (hasManageMessagePermissions === 'false') {
        return
    }

    if (command === `${config.prefix}mp`) {

        let platform = args[0];
        let username = args.slice(1).join('%20');

        let allowedPlatforms = ["xbl","psn","pc"];

        if (!username) {
            message.reply(`Incorrect command format, e.g ${config.prefix}cr platform{pc|psn|xbl} username`);
            message.reply(`Valid platforms ${allowedPlatforms}`);
            return
        }
        if (!platform) {
            message.reply(`Incorrect command format, e.g ${config.prefix}cr platform{pc|psn|xbl} username`);
            message.reply(`Valid platforms ${allowedPlatforms}`);
            return
        }

        if (allowedPlatforms.indexOf(platform) > -1 ) {

            multiplayerCombatRecord.get(client,username,platform)
                .then(function (formattedCombatRecord) {
                    message.reply(formattedCombatRecord);
                    message.delete()
                })
                .catch(function (err) {
                    console.log(`Error: ${err}`)
                })
        } else {
            message.reply("Invalid platform")
        }

    }

    if (command === `${config.prefix}zm`) {

        let platform = args[0];
        let username = args.slice(1).join('%20');

        let allowedPlatforms = ["xbl","psn","pc"];

        if (!username) {
            message.reply(`Incorrect command format, e.g ${config.prefix}cr platform{pc|psn|xbl} username`);
            message.reply(`Valid platforms ${allowedPlatforms}`);
            return
        }
        if (!platform) {
            message.reply(`Incorrect command format, e.g ${config.prefix}cr platform{pc|psn|xbl} username`);
            message.reply(`Valid platforms ${allowedPlatforms}`);
            return
        }

        if (allowedPlatforms.indexOf(platform) > -1 ) {

            zombiesCombatRecord.get(client,username,platform)
                .then(function (formattedCombatRecord) {
                    message.reply(formattedCombatRecord);
                    message.delete()
                })
                .catch(function (err) {
                    console.log(`Error: ${err}`)
                })
        } else {
            message.reply("Invalid platform")
        }

    }

    if (command === `${config.prefix}bo`) {

        let platform = args[0];
        let username = args.slice(1).join('%20');

        let allowedPlatforms = ["xbl","psn","pc"];

        if (!username) {
            message.reply(`Incorrect command format, e.g ${config.prefix}cr platform{pc|psn|xbl} username`);
            message.reply(`Valid platforms ${allowedPlatforms}`);
            return
        }
        if (!platform) {
            message.reply(`Incorrect command format, e.g ${config.prefix}cr platform{pc|psn|xbl} username`);
            message.reply(`Valid platforms ${allowedPlatforms}`);
            return
        }

        if (allowedPlatforms.indexOf(platform) > -1 ) {

            blackoutCombatRecord.get(client,username,platform)
                .then(function (formattedCombatRecord) {
                    message.reply(formattedCombatRecord);
                    message.delete()
                })
                .catch(function (err) {
                    console.log(`Error: ${err}`)
                })
        } else {
            message.reply("Invalid platform")
        }

    }

    if (command === `${config.prefix}help`) {
        let helpEmbed = await helpCommand(client);
        message.reply(helpEmbed)
    }

    if (command === `${config.prefix}profile`) {
        profileCommand(message, client)
    }
    if (command === `${config.prefix}link`) {
        linkCommand(message, client)
    }
});

client.on("error", (err) => {
    console.log(err);
});

client.login(config.token);
