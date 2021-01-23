const { MessageEmbed } = require('discord.js')
const fortunes = require('../../assets/json/fortune.json')

module.exports = {
  name: "fortune"
  , aliases: [
    'ft'
    , 'fortunecookies'
  ]
  , group: 'fun'
  , description: 'Generate a random fortune'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'fortune'
    , 'ft'
  ]
  , parameters: []
  , run: async ( client, message ) => {
    message.channel.send(new MessageEmbed()
    .setColor('GREY')
    .setDescription(fortunes[Math.floor(Math.random() * fortunes.length)])
    .setAuthor(`${message.member ? message.member.displayName : message.author.username}'s fortune.`, message.author.displayAvatarURL())
    .setFooter(`Fortune | \©️${new Date().getFullYear()} Mai`)
    )
  }
}
