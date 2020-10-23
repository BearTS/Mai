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
            '\u200b\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
          + 'The **Suggestion Channel** for this server has not yet been set. '
          + 'If you are a server administrator, you may set the channel by typing:\n\n`'
          +  client.config.prefix
          + 'setsuggestch <channel ID | channel mention>`'
        )
      )

    if (!message.guild.channels.cache.has(channelID))
      return message.channel.send(
        embed.setDescription(
          '\u200b\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
        + 'The **Suggestion Channel** set for this server was invalidated. '
        + 'If you are a server administrator, you may set the channel again by typing:\n\n`'
        +  client.config.prefix
        + 'setsuggestch <channel ID | channel mention>`'
        )
      )

    if (!args.length)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please provide your suggestion message -> Keep it short and brief.`)

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
        .catch(()=> message.channel.send(`<:cancel:712586986216489011> | ${message.author}, I could not post your suggestion in the delegated suggestion channel. Make sure I have necessary permissions`))
  }
}
