const { MessageEmbed } = require('discord.js')
const quizProfile = require('../../models/quizProfileSchema')
const { commatize, ordinalize } = require('../../helper.js')

module.exports = {
  config: {
    name: 'quizleaderboard',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'games',
    description: 'View server quiz leaderboard.',
    examples: [],
    parameters: []
  },
  run: async ( client, message, args ) => {

    let rankings = await quizProfile.find({guildID: message.guild.id}).catch(()=>{})

    if (!rankings) return message.channel.send(error('~Could not connect to database~'))

    if (!rankings.length) return message.channel.send(error('No Quiz session have been recored from this server.'))

    rankings.sort( (a, b) => b.data.scores.total - a.data.scores.total)

    let field = []

    for (let x = 0; x < ((rankings.length < 11) ? (rankings.length) : 10); x++) {

      field.push({name:`\u200B`, value: `${(x===0) ? '🥇 - ' : (x===1) ? '🥈 - ' : (x===2) ? '🥉 - ' : '#'+(x+1)+" - "} **${commatize(rankings[x].data.scores.total)}** Points (W/L/S - ${commatize(rankings[x].data.games.won)}/${commatize(rankings[x].data.games.lost)}/${commatize(rankings[x].data.games.surrendered)})  <@${rankings[x].userID}>`, inline: false })

    }

    message.channel.send( new MessageEmbed()
      .setAuthor(`🏆 ${message.guild.name} Quiz Leaderboard`)
      .setDescription(`<@${rankings[0].userID}> ranked the highest with **${commatize(rankings[0].data.scores.total)+" **Points!\n\n"}`)
      .setColor('GREY')
      .addFields(field)
      .setFooter(`You (${message.member.displayName}) ranked ${ordinalize(rankings.findIndex(item => item.userID === message.author.id) + 1)} in this server!`)
      .setThumbnail(message.guild.icon ? message.guild.iconURL({format:'png',dynamic:true}) : null)
    )
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
