const {RichEmbed} = require('discord.js')
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

	const serverQueue = message.client.musicQueue.get(message.guild.id);
	if (!serverQueue) return message.channel.send('There is nothing playing.');
  embed(serverQueue.songs[0],serverQueue.songs,serverQueue).then(embedder => {
    return message.channel.send(embedder);
  })
};

module.exports.help = {
  name: 'np',
  aliases: ['nowplaying','playing'],
	group: 'music',
	description: 'Show the currently playing music.',
	examples: ['np','nowplaying'],
	parameters: []
}

function embed(song,songs,queue){
  return new Promise((resolve,reject)=>{
        const em = new RichEmbed().setColor(settings.colors.embedDefault)
        .setAuthor(`🎶 Now Playing: ${(!queue.playing) ? '(Paused)' : ''}`)
        .setThumbnail(song.image)
        .setTitle(song.title)
        .setURL(song.url)
        if (songs.length>1) {
          em.setDescription(`**Playing next**:\n[${songs[1].title}](${songs[1].url})${(songs.length>2) ? `\n\n**Playing Later**:\n[${songs[2].title}](${songs[2].url})`:''}`)
        }
        resolve(em)
  })
}
