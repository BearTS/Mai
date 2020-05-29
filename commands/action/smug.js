const nekos = require('nekos.life')
const { sfw: { smug } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: 'smug',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'action',
    description: 'The epitome of arguments: smug anime girls.',
    examples: ['smug'],
    parameters: []
  },
  run: async ( client, message ) => {

    const { url } = await smug().catch(()=>{})

    if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

    message.channel.send( new MessageEmbed()
      .setColor('GREY')
      .setImage(url)
      .setDescription(`${message.member} smugs.`)
    )
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
