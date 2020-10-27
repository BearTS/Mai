const nekos = require('nekos.life')
const { sfw: { slap } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'slap'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'Slap them friends!~'
  , examples: [
      'slap @user'
  ]
  , parameters: ['User Mention']
  , run: async ( client, message, args ) => {

    const { url } = await slap().catch(()=>{})

  if (!url) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Oops! Something went horribly wrong`)

  if (!message.mentions.members.size)
  return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, just what are you doing slapping the air?!`)

  if (message.mentions.members.first().id === client.user.id)
  return message.reply([`Ouch! How dare you slap me!`,`Stop that!`,`It hurts!`][Math.floor(Math.random() * 3)])

  if (message.mentions.members.first().id === message.author.id)
  return message.channel.send(`I'd happily oblige! But i think you need a mental check-up.`)

  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.mentions.members.first()} has been slapped by ${message.member}! That must've been painful! OwO`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  }
}
