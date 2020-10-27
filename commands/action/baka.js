const nekos = require('nekos.life')
const { sfw: { baka } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'baka'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'It\'s not like I want you to use my command.. ~Baka!'
  , examples: [
      'baka'
  ]
  , parameters: []
  , run: async ( client, message, args ) => {

    const { url } = await baka().catch(()=>{})

  if (!url) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Oops! Something went horribly wrong`)

  if (!message.mentions.members.size)
  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  if (message.mentions.members.first().id === client.user.id)
  return message.react('💢')

  if (message.mentions.members.first().id === message.author.id)
  return message.channel.send(`<:cancel:712586986216489011> | No ${message.author}, you're not Baka!`)

  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.mentions.members.first()} B~baka!`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )
  }
}
