const { MongooseModels: model } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'xptoggle',
  aliases: ['togglexp'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Toggle the xp system on/off for the server.',
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


  if (data.isxpActive) {
    data.isxpActive = false
  } else {
    data.isxpActive = true
  }


  return data.save().then(()=>{
    client.guildsettings.profiles.get(message.guild.id).xp.active = data.isxpActive

    message.channel.send(
      new MessageEmbed().setDescription(
          '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
        + `XP [Experience Points System] has been **${data.isxpActive ? 'Enabled' : 'Disabled'}** `
        + 'in this server.'
      ).setColor('GREEN')
    )
  })
  .catch(()=> message.channel.send('<:cancel:712586986216489011> | There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.'))

  }
}
