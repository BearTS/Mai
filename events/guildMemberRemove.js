const { MessageEmbed } = require('discord.js')

module.exports = (client, member) => {

  if (!client.guildsettings.get(member.guild.id) || !client.guildsettings.get(member.guild.id).goodbyeChannel){
    return
  }

  const { goodbyemsg, goodbyeChannel } = client.guildsettings.get(message.guild.id)

  const channel = client.channels.cache.get(goodbyeChannel)

  if (!channel) return

  if (!goodbyemsg) return channel.send( new MessageEmbed().setTitle(`${member.user.tag} has left our server!`).setDescription(` We are mow back to ${member.guild.memberCount}`).setThumbnail(member.user.displayAvatarURL({ format:'png', dynamic: true})).setColor('RANDOM')).catch(()=>{})

  return channel.send(welcomemsg.replace(`{user}`, `<@${member.id}>`).replace(`{membercount}`, member.guild.memberCount)).catch(()=>{})

}
