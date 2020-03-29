const Discord = require("discord.js");
const settings = require('./../../botconfig.json');

module.exports.run = async (bot, message, args) => {

const args2 = message.cleanContent.split(/ +/).slice(1)

const desc = (!args.length) ? `${message.author.username} has paid their respects.` : `${message.author.username} has paid their respects to ${args2.join(' ')}`;
const embed = new Discord.RichEmbed()
    .setDescription(desc)
    .setColor(settings.colors.embedDefault)
    .setFooter(`Press F to pay your respects.`);
    message.delete();
message.channel.send(embed).then(m => m.react("🇫")).catch(console.error);

 }

module.exports.help = {
  name: "f",
  aliases: ["respect","rep","+rep"],
	group: 'fun',
	description: 'Show your respect, fella',
	examples: ['f Sakurajimai\'s post','+rep'],
	parameters: ['message content']
}
