const Discord = require('discord.js');
const config = require('../config/config.json');

module.exports = function (client) {

    return new Promise(function (resolve, reject) {

        let message = "```" +
            " == Commands/Help ==\n\n" +
            " == Gamemodes == \n" +
            `${config.prefix}mp       || Displays multiplayer stats               || ${config.prefix}mp, ${config.prefix}mp @Lewey#6767, ${config.prefix}mp pc Lewey#21445\n` +
            `${config.prefix}bo       || Displays blackout stats                  || ${config.prefix}bo, ${config.prefix}bo @Lewey#6767, ${config.prefix}bo psn Lewey\n` +
            `${config.prefix}zm       || Displays zombies stats                   || ${config.prefix}zm, ${config.prefix}zm @Lewey#6767, ${config.prefix}zm xbl Lewey\n\n` +
            " == Other == \n" +
            `${config.prefix}link     || Links discord to platform and username   || ${config.prefix}link pc lewey#21234, ${config.prefix}link psn Lewey-- \n` +
            `${config.prefix}profile  || View your linked account                 || ${config.prefix}profile, ${config.prefix}profile @dave#3453\n\n` +
            "Developed by @Lewey#6767" +
            "```";

        resolve(message)

    });
};
