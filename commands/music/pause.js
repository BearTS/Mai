const { MessageEmbed } = require('discord.js')

module.exports.run = async ( { musicQueue }, { guild : { id }, channel, member : { displayName } }) => {

const serverQueue = musicQueue.get(id)

if (serverQueue && serverQueue.playing) {

  let { connection: { dispatcher } } = serverQueue

  serverQueue.playing = false

  dispatcher.pause()

  return channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\n⏸ **${displayName}** paused the music!\n\u200B`))

}

  return channel.send(error('There is nothing playing atm.'))

}

module.exports.config = {
  name: "pause",
  aliases: [],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "music",
  guildOnly: true,
  description: "Pauses the currently playing music..",
  examples: [],
  parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
