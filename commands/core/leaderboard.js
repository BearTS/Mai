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

    const author_profile = documents.find( user => user.userID === message.author.id) || {}

    const author_rank = documents.findIndex( user => user.userID === message.author.id ) !== -1
    ? documents.findIndex( user => user.userID === message.author.id ) + 1
    : undefined

    const bars = '='.repeat(Math.max(...documents.filter(a => a.points !== 0).slice(0,10).map(el => (message.guild.member(el.userID) || { user: { tag: '<Unfetched Data>'}}).user.tag.length)) + 28)

    const value = `\`\`\`properties\n${bars}\n  Rank | Level |     XP | User\n${
      bars
    }\n${
      documents.filter(a => a.points !== 0).slice(0,10).map((user, index) =>
          `${ index < 3 ? `${' '.repeat(3)}${['🥇','🥈','🥉'][index]}` : index === 3 ? `${bars}\n${' '.repeat(5 - (index + 1).toString().length)}${index + 1}.` :`${' '.repeat(5 - (index + 1).toString().length)}${index + 1}.`} |`
          + `${' '.repeat(6 - user.level.toString().length)}${user.level} |`
          + `${' '.repeat(7 - intToString(user.points).length)}${intToString(user.points)} |`
          + ` ${(message.guild.member(user.userID) || {user: {tag: '<Unfetched Data>'}}).user.tag}` ).join('\n')
    }\n${
      bars
    }\n${
      `${' '.repeat(6 - ((author_rank || '').length + 2).toString().length)}${author_rank ? ordinalize(author_rank) : 'UR'} |`
      + `${' '.repeat(6 - (author_profile.level).toString().length || 1)}${author_profile.level || 0} |`
      + `${' '.repeat(7 - (intToString(author_profile.points) || 0).toString().length)}${intToString(author_profile.points) || 0} |`
      + ` You(${message.author.tag})`
    }\n${bars}\`\`\``

     message.channel.send({ embed: {
       description: `<@${documents[0].userID}> ranked the highest with **${commatize(documents[0].points)}**XP!`,
       color: 9807270,
       fields: [ { name: '\u200b' , value, inline: false} ],
       author: {
         name: `🏆 ${message.guild.name} Leaderboard`,
         iconURL:  message.guild.iconURL({format: 'png', dynamic: true, size: 1024}) || null
       },
       footer: { text: `XP Leaderboard | \©️${new Date().getFullYear()} Mai` }
     }})

  }
}

function intToString (value) {
  if (!value) return value
    var suffixes = ["", "k", "m", "b","t"];
    var suffixNum = Math.floor((""+value).length/3);
    var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
    if (shortValue % 1 != 0) {
        shortValue = shortValue.toFixed(1);
    }
    return shortValue+suffixes[suffixNum];
}
