const { MongooseModels: { guildProfileSchema }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'welcometoggle',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Toggle the \`Member Greeter\` on and off.',
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

    data.welcomeEnabled = !data.welcomeEnabled

    return data.save()
    .then(data => {
      guildProfile.welcome.enabled = data.welcomeEnabled
      return message.channel.send(
       new MessageEmbed().setDescription(
           '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
           + `Member Greeter Feature has been successfully **${data.welcomeEnabled ? 'enabed' : 'disabled'}**!
           \nTo **${!data.welcomeEnabled ? 'enabe' : 'disable'}** this feature, use the \`${client.config.prefix}welcometoggle\` command.
           ${!guildProfile.welcome.message && data.welcomeEnabled ? `\u2000\⚠ Member Greeter Message has not been configured. [Learn](https://mai-san.ml/) how to customize one.` : ''}
           ${!guildProfile.welcome.channel && data.welcomeEnabled ? `\u2000\⚠ Member Greeter channel has not been set! Set one by using the \`${client.config.prefix}setwelcomech\` command!` : ''}`
         ).setColor('GREEN').setFooter('Member Greeter | ©️2020 Mai')
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
