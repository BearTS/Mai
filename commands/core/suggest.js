const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'suggest'
  , aliases: []
  , guildOnly: true
  , group: 'core'
  , description: 'Suggest something for the server.'
  , clientPermissions: [
    'EMBED_LINKS'
    , 'ADD_REACTIONS'
  ]
  , examples: ['suggest Please remove some inactive members.....']
  , parameters: ['suggestion content']
  , run: async (client, message, args) => {

    const channelID = client.guildsettings.get(message.guild.id).featuredChannels.suggest

    const embed = new MessageEmbed()
      .setColor('RED')
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')

    if (!channelID)
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, The **Suggestion Channel** for this server has not yet been set.\n\n`
          + `If you are a server administrator, you may set the channel by typing: \`${client.config.prefix}setsuggestch <channel ID | channel mention>\``
        ).setAuthor('No Channel','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setFooter(`Suggest | \©️${new Date().getFullYear()} Mai`)
      )

    if (!message.guild.channels.cache.has(channelID))
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, The **Suggestion Channel** for this server was invalidated.\n\n`
          + `If you are a server administrator, you may set the channel by typing: \`${client.config.prefix}setsuggestch <channel ID | channel mention>\``
        ).setAuthor('Invalid Channel','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setFooter(`Suggest | \©️${new Date().getFullYear()} Mai`)
      )

    if (!args.length)
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, Please include your **suggestion message**.\n\n`
          + `Keep it short and brief.`
        ).setAuthor('No Message','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setFooter(`Suggest | \©️${new Date().getFullYear()} Mai`)
      )

    const channel = message.guild.channels.cache.get(channelID)

    return channel.send(
      new MessageEmbed()
      .setTitle(`${message.member.displayName}'s suggestion`)
      .setColor('YELLOW')
      .setDescription(args.join(' '))
      .setThumbnail(message.author.displayAvatarURL({format:'png',dynamic:true,size:1024}))
      .addField('Status','Under Review', true)
    )
      .then(()=> message.react('✅'))
        .catch(()=> message.channel.send(embed.setDescription(
          `**${message.member.displayName}**, I have no permissions to send message on the suggestion channel.\n\n`
          + `If you are a server administrator, please make sure I have the necessary permissions. (Send Messages, Embed Links, Add Reactions)`
        ).setAuthor('Unable to Post Suggestion','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setFooter(`Suggest | \©️${new Date().getFullYear()} Mai`)))
  }
}
