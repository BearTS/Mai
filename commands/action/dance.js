const { MessageEmbed } = require('discord.js')
const { dance } = require('../../assets/json/images.json')

module.exports = {
    name: 'dance'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'UWAA~!'
  , examples: [
      'dance'
  ]
  , parameters: []
  , run: async ( client, message, args ) => {

    return message.channel.send( new MessageEmbed()
    .setColor('GREY')
    .setDescription(`${message.member} started danceing!`)
    .setImage(`https://i.imgur.com/${dance[Math.ceil(Math.random() * dance.length)]}.gif`)
    .setFooter(`© ${message.guild.me.displayName}`, client.user.displayAvatarURL())
    )
  }
}
