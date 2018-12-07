/**
 * @file cat.js
 * @author Lewey
 * @description retrieve health stats
 *
 * Dev only command
 **/

const esCat = require('../../elasticsearch/elasticsearchCat');

module.exports = async function (message, client) {

    if (!message) return;

    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let esType = args[0];
    let esResponse = await esCat(esType);

    message.reply("```" + esResponse + "```")

};