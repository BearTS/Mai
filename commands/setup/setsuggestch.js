const { MongooseModels: { guildProfileSchema }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'setsuggestch',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up the suggestion channel',
  examples: ['setsuggestch #suggestions'],
  parameters: ['Channel ID', 'Channel Mention'],
  run: async ( client, message ) => {

    const channelID = message.content.match(/\d{17,19}/)

    if (!channelID)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, please provide a valid channel ID or channel mention`)

    const channel = message.guild.channels.cache.get(channelID[0])

    if (!channel || channel.type !== 'text')
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, the supplied ID is invalid`)

    if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES'))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, I can't type anything in ${channel}. Please adjust the necessary permissions for me on that channel and try again.`)

    let data = await guildProfileSchema.findOne({
      guildID: message.guild.id
    }).catch((err) => err)

    if (!data)
      data = await new guildProfileSchema({
        guildID: message.guild.id
      }).save()
          .catch((err) => err)

    if (data instanceof MongooseError)
    return message.channel.send(
      new MessageEmbed().setDescription(
          '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
        + 'Unable to contact the database. Please try again later or report this incident to my developer.'
        + '\u2000\u2000\n\n\u200b'
      )
    )

    data.suggestChannel = channel.id

    return data.save()
      .then( data => {
        client.guildsettings.get(message.guild.id).suggestChannel = data.suggestChannel
        return message.channel.send(`Successfully set the suggest channel to ${channel}!`)
      })
        .catch(() =>
          message.channel.send(`<:cancel:712586986216489011> | ${message.author}, There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.`)
        )
  }
}
