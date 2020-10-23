const { MongooseModels: { guildWatchlistSchema }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'setanischedch',
  aliases: ['setanischedulechannel','setanischedulech','setanischedchannel'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Where will i post the announcement for recently aired anime?',
  examples: ['setanischedch #airing-anime'],
  parameters: ['ChannelID', 'Channel Mention'],
  run: async ( client, message ) => {

    const channelID = message.content.match(/\d{17,19}/)

    if (!channelID)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, please provide a valid channel ID or channel mention`)

    const channel = message.guild.channels.cache.get(channelID[0])

    if (!channel || channel.type !== 'text')
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, the supplied ID is invalid`)

    if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES'))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, I can't type anything in ${channel}. Please adjust the necessary permissions for me on that channel and try again.`)

    let data = await guildWatchlistSchema.findOne({
      guildID: message.guild.id
    }).catch(err => err)

    if (!data)
      data =  await new guildWatchlistSchema({
        guildID: message.guild.id
      }).save()
          .catch((err) => err)

    if (data instanceof MongooseError)
    return message.channel.send(
      new MessageEmbed().setDescription(
          '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
        + 'Unable to contact the database. Please try again later or report this incident to my developer.'
        + '\u2000\u2000\n\n\u200b'
      ).setColor('RED')
    )

    data.channelID = channel.id

    return data.save()
      .then(() => {
        client.guildsettings.profiles.get(message.guild.id).featuredChannels.anisched = channel.id
        message.channel.send(`Successfully set the anime airing notification channel to ${channel}!`)
      })
        .catch(() => message.channel.send(`<:cancel:712586986216489011> | ${message.author}, There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.`))
  }
}
