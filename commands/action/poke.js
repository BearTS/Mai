const nekos = require('nekos.life')
const { sfw: { poke } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'poke'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'Poke your friends!'
  , examples: [
      'poke @user'
  ]
  , parameters: ['User Mention']
  , run: async ( client, message, args ) => {

    const { url } = await poke().catch(()=>{})

  if (!url) return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Oops! Something went horribly wrong`)

  if (!message.mentions.members.size)
  return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, who am I supposed to poke?`)

  if (message.mentions.members.first().id === client.user.id)
  return message.reply('I\'m already here! Need something?')

  if (message.mentions.members.first().id === message.author.id)
  return message.channel.send(`<:cancel:767062250279927818> | No!`)

  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.member} poked ${message.mentions.members.first()}!`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )
  }
}
