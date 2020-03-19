const Discord = require("discord.js");
const settings = require('./../../botconfig.json');

module.exports.run = async (bot, message, args) => {

const embed = new Discord.RichEmbed()
.setColor(settings.colors.embedDefault)
.setAuthor(bot.user.username,bot.user.displayAvatarURL)
.setDescription(`I am running on **${roundTo(bot.ping,2)}** ms.`);

message.channel.send(embed).catch(console.error)

}

module.exports.help = {
	name: "ping",
	aliases: ['latency', 'l', 'p'],
	group: 'utility',
	description: 'Get my ping information',
	examples: ['ping'],
	parameters: []
}

function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {
        n = (n * -1).toFixed(2);
    }
    return n;
}
