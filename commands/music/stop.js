const {RichEmbed} = require('discord.js')
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

  const {voiceChannel} = message.member

  if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');

	const serverQueue = message.client.musicQueue.get(message.guild.id);

	if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');

  serverQueue.songs = [];

  serverQueue.connection.dispatcher.end('Stop command has been used!');

  return message.channel.send(`Stopped the music! Stopped by ${message.member.displayName}`);

  }


module.exports.help = {
  name: 'stop',
  aliases: [],
	group: 'music',
	description: 'Stops the currently playing music and removes all the music from queue',
	examples: ['stop'],
	parameters: []
}
