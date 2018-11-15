const Discord = require('discord.js');

module.exports = function (client) {

    return new Promise(function (resolve, reject) {

        rEmbed = new Discord.RichEmbed()
            .setTitle('Command Help')
            .addField('Combat Record','bo4!cr <platform> <username>',true)
            .addField('Parameters','Platform = xbl, psn, battle | Username = users username',true)
            .setAuthor(client.user.username, client.user.avatarURL);

        resolve(rEmbed)

    });
};
