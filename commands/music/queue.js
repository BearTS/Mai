const {RichEmbed} = require('discord.js')
const settings = require("./../../botconfig.json");
const utils = require("./../../utils/majUtils.js");

module.exports.run = (bot,message,args) => {

	const serverQueue = message.client.musicQueue.get(message.guild.id);
	if (!serverQueue) return message.channel.send('There is nothing playing.');
  embed(serverQueue).then(embedder => {
    return message.channel.send(embedder);
  })
};

module.exports.help = {
  name: 'queue',
  aliases: [],
	group: 'music',
	description: 'Shows the list of queued music.',
	examples: ['queue'],
	parameters: []
}

function embed(queue){
  return new Promise((resolve,reject)=>{
        const em = new RichEmbed().setColor(settings.colors.embedDefault)
        .setAuthor(`🎶Song Queue: ${(!queue.playing) ? '(Paused)' : ''}`)
        .setDescription(utils.textTrunctuate(`${queue.songs.map(song => `**-** [${song.title}](${song.url})`).join('\n')}`,2000))
        resolve(em)
  })
}
