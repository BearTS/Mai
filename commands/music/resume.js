const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "resume",
    aliases: ['continue'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'music',
    description: 'Resumes the currently paused music.',
    examples: ['resume'],
    parameters: ['search query','youtube url']
  },
  run: async ( { musicQueue }, { guild : { id }, channel, member : { displayName } }) => {

  const serverQueue = musicQueue.get(id)

  if (serverQueue && !serverQueue.playing) {

    let { connection: { dispatcher } } = serverQueue

    serverQueue.playing = true

    dispatcher.resume()

    return channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\n▶ **${displayName}** resumed the music!\n\u200B`))

  }

    return channel.send(error('There is nothing paused atm.'))
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
