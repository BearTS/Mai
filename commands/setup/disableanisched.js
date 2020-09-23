const { MongooseModels: model } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'disableanisched',
  aliases: ['anischedoff'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Disable the anisched feature for this server',
  examples: [],
  parameters: [],
  run: async (client, message) => {

  let data = await model.guildWatchlistSchema.findOne({
    guildID: message.guild.id
  }).catch(err => err)

  if (!data) data = await new model.guildWatchlistSchema({
    guildID: message.guild.id
  }).save().catch(err => err)

  if (data instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setDescription(`
        \u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000
        Unable to contact the database. Please try again later or report this incident to my developer.'
        \u2000\u2000\n\n\u200b`
    ).setColor('RED')
  )

  if (!data.channelID)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
      + 'Anischedule Feature is already disabled in this server.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  data.channelID = null

  return data.save()
    .then(()=>{
      client.guildsettings.profiles.get(message.guild.id).suggestChannel = null
      message.channel.send('Successfully disabled the Anisched Feature')
    })
      .catch(()=> message.channel.send('<:cancel:712586986216489011> | There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.'))

  }
}
