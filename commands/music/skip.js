const {RichEmbed} = require('discord.js')
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

  const {voiceChannel} = message.member

  if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');

	const serverQueue = message.client.musicQueue.get(message.guild.id);

	if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');

  serverQueue.connection.dispatcher.end('Skip command has been used!');

  return message.channel.send(`Skipped the music! Skipped by ${message.member.displayName}`);

  }


module.exports.help = {
  name: 'skip',
  aliases: [],
	group: 'music',
	description: 'Skips the currently playing music.',
	examples: ['skip'],
	parameters: []
}
