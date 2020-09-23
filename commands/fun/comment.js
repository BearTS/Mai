const { MessageAttachment } = require('discord.js')

module.exports = {
  name: 'comment'
  , aliases: []
  , guildOnly: true
  , group: 'fun'
  , description: 'Comment something and return a youtube-like comment image'
  , clientPermissions: [
    'ATTACH_FILES'
  ]
  , examples: []
  , parameters: []
  , run: async ( client, message, args ) => {

    if (!args || !args.join(' ').replace(/(<(|a):(\w{1,32})?:(\d{17,19})>)/g,''))
      return message.channel.send('Yes, but where\'s your comment?')

    return message.channel.send({
      files: [
        {
          attachment:
          'https://some-random-api.ml/canvas/youtube-comment?avatar='
          + message.author.displayAvatarURL({format: 'png', size: 1024})
          + '&username='
          + encodeURI(message.member.displayName)
          + '&comment='
          + encodeURI(args.join(' ').replace(/(<(|a):(\w{1,32})?:(\d{17,19})>)/g,''))
          , name: 'eiyuutubu.png'
        }
      ]
    })
  }
}
