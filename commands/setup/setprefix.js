const { MongooseModels: { guildProfileSchema }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'setprefix',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up custom prefix for this server.',
  examples: ['setprefix -'],
  parameters: ['prefix'],
  run: async (client, message, [prefix]) => {

    if (!prefix)
    return message.channel.send(
      new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + 'Please tell me the prefix you want me to listen to.'
      ).setColor('RED')
    )

    if (prefix.length > 5)
    return message.channel.send(
      new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + 'Prefix are supposed to be short! \n\n Please supply prefix not exceeding 5 characters in length.'
      ).setColor('RED')
    )

    let data = await guildProfileSchema.findOne({
      guildID: message.guild.id
    }).catch(() => null)
    || await new guildProfileSchema({
      guildID: message.guild.id
    }).save().catch(err => err)

    if (data instanceof MongooseError)
    return message.channel.send(
      new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      ).setColor('RED')
    )

    data.prefix = ['clear','reset'].includes(prefix) ? null : prefix

    return data.save()
    .then(data => {
      client.guildsettings.get(message.guild.id).prefix = data.prefix
      return message.channel.send(
       new MessageEmbed().setDescription(
           '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
           + `Successfully ${data.prefix ? `set this server's prefix to ${prefix}!` : `removed this server's prefix!` }!
           \n${data.prefix ? `To remove the prefix, just pass in \`reset\` or \`clear\` as parameter.` : `To add prefix, simply pass the desired prefix as parameter.`}`
         ).setColor('GREEN').setFooter('Custom Prefix | ©️2020 Mai')
       )
    }).catch(()=>
    message.channel.send(
      new MessageEmbed().setDescription(
        `<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
      `).setColor('RED')
    )
  )

  }
}
