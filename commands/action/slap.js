const nekos = require('nekos.life')
const { sfw: { slap } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: 'slap',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'action',
    description: 'Slap your worthless friends!',
    examples: ['slap @user'],
    parameters: ['User Mention']
  },
  run: async ( client, message ) => {

    const { url } = await slap().catch(()=>{})

    if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

    const embed = new MessageEmbed()

    if (message.mentions.members.size && message.mentions.members.first().id === client.user.id){

      return message.channel.send(error(`${[`Ouch! How dare you slap me!`,`Stop that!`,`It hurts!`][Math.floor(Math.random() * 2)]}`))

    } else if (message.mentions.members.size && message.mentions.members.first().id === message.author.id){

      return message.channel.send(error(`Wai~ Seriously!?`))

    } else if (message.mentions.members.size) {

      return message.channel.send(embed.setColor('GREY').setDescription(`${message.member} slapped ${message.mentions.members.first()}!`).setImage(url))

    } else {

    return message.channel.send(error(`${message.member}, you're practicing to slap or something?`))

    }
  }
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
