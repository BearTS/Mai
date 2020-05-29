const { MessageEmbed } = require('discord.js')
const { textTrunctuate } = require('../../helper.js')

module.exports = {
  config: {
    name: "queue",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'music',
    description: "Shows the list of queued music.",
    examples: ['queue'],
    parameters: ['search query','youtube url']
  },
  run: async ( { musicQueue }, { guild : { id }, channel }) => {

  const serverQueue = musicQueue.get(id)

  if (!serverQueue) return channel.send(error('There is nothing Playing atm.'))

  if (!serverQueue.songs.length) return channel.send(error('There is nothing Playing atm.'))

  const { playing, songs } = serverQueue

  return channel.send(new MessageEmbed().setAuthor(`🎶Song Queue: ${(!playing) ? '(Paused)' : ''}`).setDescription(textTrunctuate(`${songs.map(song => `**-** [${song.title}](${song.url})`).join('\n')}`,2000)).setColor('GREY'))

  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
