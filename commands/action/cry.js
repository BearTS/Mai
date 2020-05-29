const { MessageEmbed } = require('discord.js')
const { cry } = require('../../assets/json/images.json')

module.exports = {
  config: {
    name: 'cry',
    aliases: ['sob','waa'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'action',
    description: 'UWAA~!',
    examples: ['cry'],
    parameters: []
  },
  run: async ( client, message ) => {

    message.channel.send( new MessageEmbed()
    .setColor('GREY')
    .setDescription(`${message.member} started crying!`)
    .setImage(`https://i.imgur.com/${cry[Math.ceil(Math.random() * cry.length)]}.gif`)
    )
  }
}
