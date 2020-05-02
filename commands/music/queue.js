const { MessageEmbed } = require('discord.js')
const { textTrunctuate } = require('../../helper.js')

module.exports.run = async ( { musicQueue }, { guild : { id }, channel }) => {

const serverQueue = musicQueue.get(id)

if (!serverQueue) return channel.send(error('There is nothing Playing atm.'))

if (!serverQueue.songs.length) return channel.send(error('There is nothing Playing atm.'))

const { playing, songs } = serverQueue

return channel.send(new MessageEmbed().setAuthor(`🎶Song Queue: ${(!playing) ? '(Paused)' : ''}`).setDescription(textTrunctuate(`${songs.map(song => `**-** [${song.title}](${song.url})`).join('\n')}`,2000)).setColor('GREY'))

}

module.exports.config = {
  name: "queue",
  aliases: [],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "music",
  guildOnly: true,
  description: "Shows the list of queued music.",
  examples: ['queue'],
  parameters: ['search query','youtube url']
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
