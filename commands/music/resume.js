const { MessageEmbed } = require('discord.js')

module.exports.run = async ( { musicQueue }, { guild : { id }, channel, member : { displayName } }) => {

const serverQueue = musicQueue.get(id)

if (serverQueue && !serverQueue.playing) {

  let { connection: { dispatcher } } = serverQueue

  serverQueue.playing = true

  dispatcher.resume()

  return channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\n▶ **${displayName}** resumed the music!\n\u200B`))

}

  return channel.send(error('There is nothing paused atm.'))

}

module.exports.config = {
  name: "resume",
  aliases: ['continue'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "music",
  guildOnly: true,
  description: 'Resumes the currently paused music.',
  examples: ['resume'],
  parameters: ['search query','youtube url']
}
