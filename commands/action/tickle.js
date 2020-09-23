const nekos = require('nekos.life')
const { sfw: { tickle } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'tickle'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'Tickle your friends!'
  , examples: [
      'tickle @user'
  ]
  , parameters: ['User Mention']
  , run: async ( client, message, args ) => {

    const { url } = await tickle().catch(()=>{})

  if (!url) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Oops! Something went horribly wrong`)

  if (!message.mentions.members.size)
  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url))

  if (message.mentions.members.first().id === client.user.id)
  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`Stop ${message.member}! It tickles~`))

  if (message.mentions.members.first().id === message.author.id)
  return message.channel.send(`<:cancel:712586986216489011> | Have fun tickling yourself ${message.author}!`)

  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.member} tickled ${message.mentions.members.first()}!`))
  }
}
