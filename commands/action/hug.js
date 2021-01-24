const nekos = require('nekos.life')
const { sfw: { hug } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'hug'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'Hug someone special.'
  , examples: [
      'hug @user'
  ]
  , parameters: ['User Mention']
  , run: async ( client, message, args ) => {

    const { url } = await hug().catch(()=>{})

  if (!url) return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Oops! Something went horribly wrong`)

  if (!message.mentions.members.size || message.mentions.members.first().id === message.author.id)
  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.member} H~here! I thought you needed a hug!`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  if (message.mentions.members.first().id === client.user.id)
  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.member} H~how thoughtful! Thank you! ʸᵒᵘ'ʳᵉ ⁿᵒᵗ ˢᵃᵏᵘᵗᵃ ᵗʰᵒ`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  return message.channel.send(new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.mentions.members.first()} was being hugged by ${message.member}! How caring!`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )

  }
}
