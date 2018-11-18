const Discord = require('discord.js');

module.exports = function (client) {

    return new Promise(function (resolve, reject) {

        rEmbed = new Discord.RichEmbed()
            .setTitle('Command Help')
            .addField('Combat Record','bo4!cr <platform> <username>',true)
            .addField('Parameters','platform{pc|psn|xbl} username = your username or battlenet id',true)
            .setAuthor(client.user.username, client.user.avatarURL)
            .setFooter('Developed by @Lewey#6767');

        resolve(rEmbed)

    });
};
