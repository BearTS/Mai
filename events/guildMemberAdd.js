const { MessageEmbed } = require('discord.js')
const { ordinalize } = require('../helper.js')
const { magenta } = require('chalk')

module.exports = (client, member) => {

  if (!client.guildsettings.get(member.guild.id) || !client.guildsettings.get(member.guild.id).welcomeChannel){
    return  console.log(`${magenta('[Mai-Promise ERROR]')} : Welcome Message is disabled on ${member.guild.name}.`)
  }

  const { welcomemsg, welcomeChannel } = client.guildsettings.get(member.guild.id)

  const channel = client.channels.cache.get(welcomeChannel)

  if (!channel) return console.log(`${magenta('[Mai-Promise ERROR]')} : Welcome Message is enabled, but no channel is found. [${member.guild.name}]`)

  if (!channel.permissionsFor(channel.guild.me).has('SEND_MESSAGES')) return console.log(`${magenta('[Mai-Promise ERROR]')} : MISSING SEND_MESSAGES PERMISSIONS. Cannot send welcome message [${member.guild.name}]`)

  if (!welcomemsg) return channel.send( new MessageEmbed().setTitle(`${member.user.tag} has joined our server!`).setFooter(`You are our ${ordinalize(member.guild.memberCount)} member!`).setDescription(`Hello ${member}, welcome to **${member.guild.name}**!`).setThumbnail(member.user.displayAvatarURL({ format:'png', dynamic: true})).setColor('RANDOM')).catch(()=>{})

  return channel.send(welcomemsg.replace(/{user}|{member}/gi, `${member}`).replace(/{membercount}/gi, `${member.guild.memberCount}`)).catch(()=>{})

}
