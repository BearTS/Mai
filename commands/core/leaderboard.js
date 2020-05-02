const xp = require('../../models/xpSchema.js')
const { MessageEmbed } = require('discord.js')
const { commatize, ordinalize } = require('../../helper.js')

module.exports.run = async (client, message, args ) => {

  const { xpExceptions } = client.guildsettings.get(message.guild.id)

  if (xpExceptions.includes(message.channel.id)) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`XP is currently disabled in this channel.`))

  let xpdoc = await xp.find({ guildID: message.guild.id }).catch()

  xpdoc.sort(( a, b ) => b.points - a.points)

  if (!xpdoc.length) return message.channel.send(error(`Members in this server has not started earning xp!`))

  let field = []

  for (let x = 0; x < ((xpdoc.length < 11) ? (xpdoc.length) : 10); x++) {

    field.push({name:`\u200B`, value: `${(x===0) ? '🥇 - ' : (x===1) ? '🥈 - ' : (x===2) ? '🥉 - ' : '#'+(x+1)+" - "} **${commatize(xpdoc[x].points)}**XP (Level ${xpdoc[x].level})  <@${xpdoc[x].userID}>`, inline: false })

  }

  message.channel.send( new MessageEmbed()
    .setAuthor(`🏆 ${message.guild.name} Leaderboard`)
    .setDescription(`<@${xpdoc[0].userID}> ranked the highest with **${commatize(xpdoc[0].points)+"**XP!\n\n"}`)
    .setColor('GREY')
    .addFields(field)
    .setFooter(`You (${message.member.displayName}) ranked ${ordinalize(xpdoc.findIndex(item => item.userID === message.author.id) + 1)} in this server!`)
    .setThumbnail(message.guild.icon ? message.guild.iconURL({format:'png',dynamic:true}) : null)
  )
}

module.exports.config = {
  name: "leaderboard",
  aliases: ['lb','top'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "core",
  guildOnly: true,
  rankcommand: true,
  description: "Shows the top xp earners for this server",
  examples: [],
	parameters: []
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
