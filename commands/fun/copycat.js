const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');


module.exports.run = async (bot, message, args) =>{

var user = message.mentions.members.first();
var channel = (message.mentions.channels.first()) ? message.mentions.channels.first() : message.channel;

if(!user) return message.channel.send(`Please mention a user!`);

var msg = args.join(' ').replace(`<@!${user.id}>`,'').replace(`<#${channel.id}>`,'');
var name = user.displayName;
var avatar = user.user.displayAvatarURL;

if(msg.length < 1) return message.channel.send(`Please specify the message!!!`).then(msg => msg.delete(15000)).catch(console.error);

  var hook = await channel.createWebhook(name,avatar)
  await hook.send(msg).catch(console.error);

  setTimeout(async function() {
      await hook.delete()
  }, 1000);
}

module.exports.help = {
  name: "cc",
  aliases: ["copycat","sfm","silentfakemessage"],
	group: 'fun',
	description: 'Copy the user nickname and Avatar and sends message to a specific channel.',
	examples: ['cc Sakurajimai #general This is a silent fake message','sfm sakurajimai this is a fake message, im not a bot.'],
	parameters: ['channel mention','user mention','message content']
}
