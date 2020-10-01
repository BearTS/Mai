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

    const url = safe[Math.floor(Math.random() * safe.length)]

    return message.channel.send(
      new MessageEmbed()
        .setColor('GREY')
        .attachFiles([
          {
            attachment: url,
            name: `mai.${url.split('.').pop()}`
          }
        ])
        .setImage(
          `attachment://mai.${url.split('.').pop()}`
      )
    )
  }
}
