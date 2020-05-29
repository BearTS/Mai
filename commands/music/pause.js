const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "pause",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'music',
    description: "Pauses the currently playing music..",
    examples: [],
    parameters: []
  },
  run: async ( { musicQueue }, { guild : { id }, channel, member : { displayName } }) => {

  const serverQueue = musicQueue.get(id)

  if (serverQueue && serverQueue.playing) {

    let { connection: { dispatcher } } = serverQueue

    serverQueue.playing = false

    dispatcher.pause()

    return channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\n⏸ **${displayName}** paused the music!\n\u200B`))

  }

    return channel.send(error('There is nothing playing atm.'))

  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
