const nekos = require('nekos.life')
const { sfw: { pat } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'pat'
  , aliases: ['headpat']
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'It\'s not like I want you to use my command.. ~Baka!'
  , examples: [
      'pat @user'
  ]
  , parameters: ['User Mention']
  , run: async ( client, message, args ) => {

    const { url } = await pat().catch(()=>{})

  if (!url) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Oops! Something went horribly wrong`)

  if (!message.mentions.members.size || message.mentions.members.first().id === message.author.id)
  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`Here you go ${message.member}, \*pat* \*pat*`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  if (message.mentions.members.first().id === client.user.id)
  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`UwU <3! Thanks!`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.member} pats ${message.mentions.members.first()}`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  }
}
