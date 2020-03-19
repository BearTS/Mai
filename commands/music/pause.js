const {RichEmbed} = require('discord.js')
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

	const serverQueue = message.client.musicQueue.get(message.guild.id);
	if (serverQueue && serverQueue.playing) {
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause()
    return message.channel.send(`⏸ Paused the music! Paused by ${message.member.displayName}`);
    }
    return message.channel.send('There is nothing playing.');
  }


module.exports.help = {
  name: 'pause',
  aliases: [],
	group: 'music',
	description: 'Pauses the currently playing music.',
	examples: ['pause'],
	parameters: []
}
