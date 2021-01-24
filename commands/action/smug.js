const nekos = require('nekos.life')
const { sfw: { smug } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'smug'
  , aliases: []
  , guildOnly: true
  , clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ]
  , group: 'action'
  , description: 'The epitome of arguments: smug anime girls.'
  , examples: [
      'smug'
  ]
  , parameters: []
  , run: async ( client, message, args ) => {

   const { url } = await smug().catch(()=>{})

    if (!url) return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Oops! Something went horribly wrong`)

    return message.channel.send( new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.member} smugs.`)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    )
  }
}
