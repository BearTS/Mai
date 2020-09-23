const { MessageAttachment } = require('discord.js')

module.exports = {
  name: 'wasted'
  , aliases: []
  , guildOnly: true
  , group: 'fun'
  , description: 'Wasted users'
  , clientPermissions: [
    'ATTACH_FILES'
  ]
  , examples: []
  , parameters: []
  , run: async ( client, message ) => {

    const match = message.content.match(/\d{17,19}/);

    let member = match
                ? await message.guild.members.fetch(match[0]).catch(()=> null)
                : null

    if (!member)
      return message.channel.send('だれ?')

    return message.channel.send({
      files: [
        {
          attachment:
          'https://some-random-api.ml/canvas/wasted?avatar='
          + member.user.displayAvatarURL({format: 'png', size: 1024})
          , name: 'watseduwu.png'
        }
      ]
    })
  }
}
