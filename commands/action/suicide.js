const { MessageEmbed } = require('discord.js')
const { suicide } = require('star-labs')

module.exports = {
  config: {
    name: 'suicide',
    aliases: ['kms'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'action',
    description: 'Suicide. Self-Murder.',
    examples: ['suicide','kms'],
    parameters: []
  },
  run: async ( client, message ) => {

  return message.channel.send( new MessageEmbed()
      .setColor('GREY')
      .setImage(suicide())
      .setDescription(`${message.member} killed himself/herself.`)
    )
  }
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
