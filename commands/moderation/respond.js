const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'respond',
  aliases: [],
  guildOnly: true,
  group: 'moderation',
  description: 'Respond to user suggestion',
  examples: ['respond 690105173087223812 deny Doesn\'t make much sense to do this and it does not seem to have much support'],
  parameters: ['messsage ID','accept/deny','reason'],
  run: async ( client, message, [id, action, ...reason]) => {

    const channelID = client.guildsettings.get(message.guild.id).suggestChannel

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

    const channel = message.guild.channels.cache.get(channelID)
    if (!channel)
      return message.channel.send(
        embed.setDescription(
          '\u200b\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
        + 'The **Suggestion Channel** set for this server was invalidated. '
        + 'If you are a server administrator, you may set the channel again by typing:\n\n`'
        +  client.config.prefix
        + 'setsuggestch <channel ID | channel mention>`'
        )
      )

    if (!id)
    return message.channel.send(
      embed.setDescription(
        'You need to supply the **message ID** of the suggestion'
      )
    )

    if (!action || !['accept','deny'].includes(action.toLowerCase()))
    return message.channel.send(
      embed.setDescription(
        'Please specify if you want to `accept` or `deny` the suggestion'
      )
    )

    if (!reason.length || reason.join(' ').length > 1024)
    return message.channel.send(
      embed.setDescription(
        'You need to supply a reason not exceeding 1024 characters.'
      )
    )

    const suggestion = await channel.messages.fetch(id)
      .catch(()=> null)

    if (
      !suggestion
      ||  suggestion.author.id !== client.user.id
      ||  !suggestion.embeds.length
      ||  !suggestion.embeds[0].title
      ||  !suggestion.embeds[0].title.endsWith('suggestion')
    ) return message.channel.send(
      embed.setDescription(
          'I can\'t seem to find the suggestion with message ID **'
        + id
        + '** in '
        + channel.toString()
        +'.'
      )
    )

    if (suggestion.embeds[0].fields.length > 1)
    return message.channel.send(
      embed.setDescription(
          '**'
        + suggestion.embeds[0].fields[0].value.replace('Accepted by ','')
        + '** already responded to this suggestion!'
      )
    )

    if (!suggestion.editable)
    return message.channel.send(
      embed.setDescription(
        'The Suggestion has somehow been invalidated (Cause Unknown).'
      )
    )

    const { fields } = suggestion.embeds[0]

    fields[0].value = action.toLowerCase() === 'accept'
    ? 'Accepted by '
      + message.author.tag
    : 'Denied by '
      + message.author.tag

    const success = await suggestion.edit(
      new MessageEmbed(suggestion.embeds[0])
      .setColor(
        action.toLowerCase() === 'accept'
        ? 'GREEN'
        : 'RED'
      )

      .addField(
          'Reason'
        , reason.join(' ')
      )
    )

    if (success)
    return message.react('✅')

    return message.channel.send(
      embed.setDescription(
        'Unable to Update Suggestion Panel!'
      )
    )
  }
}
