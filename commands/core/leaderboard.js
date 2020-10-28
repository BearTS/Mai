const { MongooseModels: { xpSchema }, TextHelpers: { commatize, ordinalize }} = require('../../helper')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'leaderboard'
  , aliases: [
    'lb'
    , 'topxp'
    , 'top'
  ]
  , guildOnly: true
  , rankcommand: true
  , group: 'core'
  , description: 'Shows the top xp earners for this server'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: []
  , run: async (client, message ) => {

    const { exceptions, active } = client.guildsettings.get(message.guild.id).xp

    const embed = new MessageEmbed()
      .setColor('RED')
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')


    if (!active)
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, XP is currently disabled in this server.\n\n`
          + `If you are the server Administrator, you may enable it by typing \`${client.config.prefix}xptoggle\`.\n`
          + `[Learn More](https://mai-san.ml/docs/features/XP_System) about Mai's XP System.`
        ).setAuthor('XP Systems Disabled','https://cdn.discordapp.com/emojis/712586986216489011.png?v=1')
        .setFooter(`XP Leaderboard | \©️${new Date().getFullYear()} Mai`)
      )


    if (exceptions.includes(message.channel.id))
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, XP is currently disabled in this channel.\n\n`
          + `To see which channels are xp-disabled, use the command \`${client.config.prefix}nonxpchannels\`\n`
          + `If you are the server Administrator, you may reenable it here by typing \`${client.config.prefix}xpenable #${message.channel.name}\`\n`
          + `[Learn More](https://mai-san.ml/docs/features/XP_System) about Mai's XP System.`
        ).setAuthor('Channel Blacklisted','https://cdn.discordapp.com/emojis/712586986216489011.png?v=1')
        .setFooter(`XP Leaderboard | \©️${new Date().getFullYear()} Mai`)
      )


    const documents = await xpSchema.find({ guildID: message.guild.id }).catch(()=>null)


    if (!documents)
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, I am unable to contact the database.\n\n`
          + `Please try again later or report this incident to my developer.`
        ).setAuthor('Database Error','https://cdn.discordapp.com/emojis/712586986216489011.png?v=1')
        .setFooter(`XP Leaderboard | \©️${new Date().getFullYear()} Mai`)
      )


    if (!documents.length || !documents.filter(a => a.points !== 0).length)
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, No XP found.\n\n`
          + `Users in this server have not started earning XP yet!\n`
          + `[Learn More](https://mai-san.ml/docs/features/XP_System) about Mai's XP System.`
        ).setAuthor('No XP','https://cdn.discordapp.com/emojis/712586986216489011.png?v=1')
        .setFooter(`XP Leaderboard | \©️${new Date().getFullYear()} Mai`)
      )


    documents.sort((a, b) => b.points - a.points)


    return message.channel.send(
      embed.setColor('GREY')

          .setThumbnail(message.guild.iconURL({format: 'png', dynamic: true, size: 1024}) || null)

          .setAuthor(`🏆 ${message.guild.name} Leaderboard`)

          .setDescription(`<@${documents[0].userID}> ranked the highest with **${commatize(documents[0].points)}**XP!\n\n\u200b`)

          .addFields(
            documents.filter(a => a.points !== 0).slice(0,10).map((user, index) =>  {
              return {
                  name: '\u200B'
                , inline: false
                , value:  `${
                  index === 0
                  ? '🥇 -'
                  : index === 1
                    ? '🥈 -'
                    : index === 2
                      ? '🥉 -'
                      : `#${index + 1} -`
                } **${
                  commatize(user.points)
                }**XP (Level ${
                  user.level
                }) <@${
                  user.userID
                }>`
              }
            })
          )

        .setFooter(`You (${message.author.tag}) ${
          documents.findIndex( user => user.userID === message.author.id) !== -1
          ? `ranked ${ordinalize(documents.findIndex( user => user.userID === message.author.id) + 1)} in this server!`
          : 'are unranked in this server\'s XP leaderboard'
        }`)

    )
  }
}
