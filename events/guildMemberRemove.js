const { MessageEmbed } = require('discord.js')
const { magenta } = require('chalk')

module.exports = (client, member) => {

  if (!client.guildsettings.get(member.guild.id) || !client.guildsettings.get(member.guild.id).goodbyeChannel){
    return
  }


  const { goodbyemsg, goodbyeChannel } = client.guildsettings.get(member.guild.id)

  const channel = client.channels.cache.get(goodbyeChannel)

  if (!channel) return console.log(`${magenta('[Mai-Promise ERROR]')} : Goodbye Message is enabled, but no channel is found. [${member.guild.name}]`)

  if (!channel.permissionsFor(channel.guild.me).has('SEND_MESSAGES')) return console.log(`${magenta('[Mai-Promise ERROR]')} : MISSING SEND_MESSAGES PERMISSIONS. Cannot send goodbye message [${member.guild.name}]`)

  if (!goodbyemsg) return channel.send( new MessageEmbed().setTitle(`${member.user.tag} has left our server!`).setDescription(` We are now back to ${member.guild.memberCount} members`).setThumbnail(member.user.displayAvatarURL({ format:'png', dynamic: true})).setColor('RANDOM')).catch(()=>{})

  return channel.send(goodbyemsg.replace(/{user}/gi, `${member}`).replace(/{membercount}/gi, member.guild.memberCount)).catch(()=>{})

}
