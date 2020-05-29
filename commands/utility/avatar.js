const { MessageEmbed } = require('discord.js')

module.exports = {
  config:{
    name: "avatar",
    aliases: ['av','pfp'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "utility",
    description: "Shows avatar of a given user",
    examples: ["avatar @user","avatar 521598384003395222"],
    parameters: ['user mention','user id']
  },
  run: (client, message, args) => {

    const match = message.content.match(/\d{18}/);

    let member = match ? message.guild.members.cache.get(match[0]) : message.member

    if (!member) member = message.member

    return message.channel.send(new MessageEmbed()
    .setDescription(`[${message.author.id === member.id ? `Your` : member.id === client.user.id ? 'Oh? Here\'s my' :`${member}'s`} avatar](${member.user.displayAvatarURL({format:'png',dynamic:true,size:1024})})`)
    .setColor(member.displayColor === 0 ? 'GREY' : member.displayColor)
    .setImage(member.user.displayAvatarURL({format:'png',dynamic:true,size:1024}))
    )
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
