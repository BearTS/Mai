const { MongooseModels: { guildProfileSchema }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'goodbyetoggle',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Toggle the \`Leaving Member Announcer\` on and off.',
  examples: [],
  parameters: [],
  run: async (client, message) => {

    const guildProfile = client.guildsettings.get(message.guild.id)

    const data = await guildProfileSchema.findOne({ guildID: message.guild.id })

    if (data instanceof MongooseError)
    return message.channel.send(
      new MessageEmbed().setDescription(
          '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
        + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      ).setColor('RED')
    )

    data.goodbyeEnabled = !data.goodbyeEnabled

    return data.save()
    .then(data => {
      guildProfile.goodbye.enabled = data.goodbyeEnabled
      return message.channel.send(
       new MessageEmbed().setDescription(
           '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
           + `Leaving Member Announcer Feature has been successfully **${data.goodbyeEnabled ? 'enabled' : 'disabled'}**!
           \nTo disable this feature, use the \`${client.config.prefix}welcometoggle\` command.
           ${!guildProfile.goodbye.msg ? `\u2000\⚠ LMA Message has not been configured. [Learn](https://mai-san.ml/) how to customize one.` : ''}
           ${!guildProfile.goodbye.channel ? `\u2000\⚠ LMA channel has not been set! Set one by using the \`${client.config.prefix}setwelcomech\` command!` : ''}`
         ).setColor('GREEN').setFooter('Leaving Member Announcer | ©️2020 Mai')
       )
    }).catch(()=>
    message.channel.send(
      new MessageEmbed().setDescription(
        `<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
      `).setColor('RED')
    )
  )

  }
}
