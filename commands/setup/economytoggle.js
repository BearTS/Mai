const { MongooseModels: model } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'economytoggle',
  aliases: ['toggleeconomy'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Toggle the economy system on/off for the server.',
  examples: [],
  parameters: [],
  run: async (client, message) => {

  let data = await model.guildProfileSchema.findOne({
    guildID: message.guild.id
  }).catch(err => err)

  if (!data) data = await new model.guildProfileSchema({
    guildID: message.guild.id
  }).save().catch(err => err)

  if (data instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )


  if (data.iseconomyActive) {
    data.iseconomyActive = false
  } else {
    data.iseconomyActive = true
  }


  return data.save().then(()=>{
    client.guildsettings.profiles.get(message.guild.id).isEconomyActive = data.iseconomyActive

    message.channel.send(
      new MessageEmbed().setDescription(
          '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
        + `Economy [Economy System] has been **${data.iseconomyActive ? 'Enabled' : 'Disabled'}** `
        + 'in this server.'
      ).setColor('GREEN')
    )
  })
  .catch(()=> message.channel.send('<:cancel:712586986216489011> | There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.'))

  }
}
