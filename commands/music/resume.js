const {RichEmbed} = require('discord.js')
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

	const serverQueue = message.client.musicQueue.get(message.guild.id);
	if (serverQueue && !serverQueue.playing) {
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume()
    return message.channel.send(`▶ Resumed the music! Resumed by ${message.member.displayName}`);
    }
    return message.channel.send('There is nothing paused.');
  }


module.exports.help = {
  name: 'resume',
  aliases: [],
	group: 'music',
	description: 'Resumes the currently paused music.',
	examples: ['resume'],
	parameters: []
}
