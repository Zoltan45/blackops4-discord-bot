const Discord = require('discord.js');
const config = require('../config/config.json');

module.exports = function (client) {

    return new Promise(function (resolve, reject) {

        rEmbed = new Discord.RichEmbed()
            .setTitle('Command Help')
            .addBlankField()
            .addField('Multiplayer Combat Record',`${config.prefix}mp <platform> <username>`,true)
            .addField('Parameters','platform{pc|psn|xbl} username = your username or battlenet id e.g Lewey#21342',true)
            .addBlankField()
            .addField('Zombies Combat Record',`${config.prefix}zm <platform> <username>`,true)
            .addField('Parameters','platform{pc|psn|xbl} username = your username or battlenet id e.g Lewey#21342',true)
            .addBlankField()
            .addField('Blackout Combat Record',`${config.prefix}bo <platform> <username>`,true)
            .addField('Parameters','platform{pc|psn|xbl} username = your username or battlenet id e.g Lewey#21342',true)
            .addBlankField()
            .addField('Link Account',`${config.prefix}link <platform> <username>`,true)
            .addField('Description', 'Link discord user to a plaform and username to quickly view stats')
            .addField('Parameters','platform{pc|psn|xbl} username = your username or battlenet id e.g Lewey#21342',true)
            .addBlankField()
            .addField('Profile',`${config.prefix}profile <@mention user>`,true)
            .addField('Description', 'View personal and other users stats if account has been linked using link command')
            .addField('Parameters',`<mention> Optional eg. ${config.prefix}profile @Lewey#6767`,true)
            .addBlankField()
            .setAuthor(client.user.username, client.user.avatarURL)
            .setFooter('Developed by @Lewey#6767');

        resolve(rEmbed)

    });
};
