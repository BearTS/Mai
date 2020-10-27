const nekos = require('nekos.life')
const { sfw: { kiss, slap } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'kiss'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'Show your love to someone special! Not me lol'
  , examples: [
      'kiss @User'
  ]
  , parameters: ['User Mention']
  , run: async ( client, message, args ) => {

    const { url } = await kiss().catch(()=>{})

    const { url: slapp } = await slap().catch(()=>{})

  if (!url) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Oops! Something went horribly wrong`)

  if (!message.mentions.members.size)
  return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, you desperate enough to kiss an invisible user?!`)

  if (message.mentions.members.first().id === client.user.id)
  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(slapp)
      .setDescription(`${message.member} E~ecchi!`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  if (message.mentions.members.first().id === message.author.id)
  return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, ever heard of a mirror?`)

  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.member} kissed ${message.mentions.members.first()}`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  }
}
