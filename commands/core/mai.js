const { LocalDatabase: { mai: { safe }}} = require('../../helper')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'mai'
  , aliases: [
    'bestgirl'
  ]
  , cooldown: null
  , group: 'core'
  , description: 'Mai is the best girl and there\'s no denying it!'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: []
  , run: async (client, message) => {

    return message.channel.send(
      new MessageEmbed()
        .setColor('GREY')
        .setImage(
          safe[Math.floor(Math.random() * safe.length)]
      )
    )
  }
}
