const { connection } = require('mongoose')
const { MessageEmbed } = require('discord.js')
const { commatize, ordinalize } = require('../../helper.js')

module.exports.run = (client, message, args ) => {

  if (!client.guildsettings.get(message.guild.id) || !client.guildsettings.get(message.guild.id).isxpActive) {
    return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`XP is currently disabled in this server.`))
  }

  const { xpExceptions } = client.guildsettings.get(message.guild.id)

  if (xpExceptions.includes(message.channel.id)) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`XP is currently disabled in this channel.`))

  connection.db.collection("xperiencepoints", (err, collection) => {

    if (err) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`An unexpected error occured!`))
    collection.find({}).toArray( (err, leaderboard) => {

      if (err) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`An unexpected error occured!`))
      leaderboard = leaderboard.filter(m => m.guildID === message.guild.id)
      leaderboard.sort( (a,b) => b.xp - a.xp)

      let field = []

      for (let x = 0; x < ((leaderboard.length < 11) ? (leaderboard.length) : 10); x++) {

        field.push({name:`\u200B`, value: `${(x===0) ? '🥇 - ' : (x===1) ? '🥈 - ' : (x===2) ? '🥉 - ' : '#'+(x+1)+" - "} **${commatize(leaderboard[x].points)}**XP (Level ${leaderboard[x].level})  <@${leaderboard[x].userID}>`, inline: false })
      }

      message.channel.send( new MessageEmbed()
        .setAuthor(`🏆 ${message.guild.name} Leaderboard`)
        .setDescription(`<@${leaderboard[0].userID}> ranked the highest with **${commatize(leaderboard[0].points)+"**XP!\n\n"}`)
        .setColor('RANDOM')
        .addFields(field)
        .setFooter(`You (${message.member.displayName}) ranked ${ordinalize(leaderboard.findIndex(item => item.userID === message.author.id) + 1)} in this server!`)
      )
    })
  })
}

module.exports.config = {
  name: "leaderboard",
  aliases: ['lb','top'],
  cooldown:{
    time: 60,
    msg: "Please limit the usage of this command."
  },
  group: "core",
  guildOnly: true,
  description: "Shows the top xp earners for this server",
  examples: [],
	parameters: []
}
