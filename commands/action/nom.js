const { MessageEmbed } = require('discord.js')
const { nom } = require('../../assets/json/images.json')

module.exports = {
    name: 'nom'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'nom nom'
  , examples: [
      'nom'
  ]
  , parameters: []
  , run: async ( client, message, args ) => {

    return message.channel.send( new MessageEmbed()
    .setColor('GREY')
    .setDescription(`nom.`)
    .setImage(`https://i.imgur.com/${nom[Math.ceil(Math.random() * nom.length)]}.gif`)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )
  }
}
