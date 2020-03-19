const {RichEmbed} = require('discord.js')
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

  const {voiceChannel} = message.member

  if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');

	const serverQueue = message.client.musicQueue.get(message.guild.id);

	if (!serverQueue) return message.channel.send('There is nothing playing.');

  if (!args[0]) return message.channel.send(`The current volume is: **${serverQueue.volume}**`);

  if (isNaN(Number(args[0]))) return message.channel.send(`Please enter a valid volume number: \`(1-5)\``);

  if ((Number(args[0])>5) || (Number(args[0])<1)) return message.channel.send(`Please enter a valid volume number: \`(1-5)\``);

  serverQueue.volume = args[0]; // eslint-disable-line

  serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);

  return message.channel.send(`I set the volume to: **${args[0]}**`);

  }


module.exports.help = {
  name: 'volume',
  aliases: [],
	group: 'music',
	description: 'Sets the volume of the music. Defaults at 2',
	examples: ['volume 4'],
	parameters: ['number']
}
