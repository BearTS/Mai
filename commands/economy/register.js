const { MongooseModels: model, TextHelpers: { commatize } } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'register',
  aliases: [],
  guildOnly: true,
  economycommand: true,
  group: 'economy',
  clientPermissions: ['EMBED_LINKS'],
  description: 'Start earning currency. Register to keep track of your earned currencies!',
  examples: [],
  parameters: [],
  run: async (client, message) => {

  let data = await model.bankSchema.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  }).catch(err => err)

  if (data instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u200b\n\n\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  if (data)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000**${message.member.displayName}**, You already have an existing **wallet**!!
        \nTo check your balance, type \`${client.config.prefix}bal\`.`
    ).setColor('RED')
  )

  const amount = Math.floor(Math.random() * 250) + 250;

  return new model.bankSchema({
      guildID: message.guild.id
    , userID: message.author.id
    , data: { wallet: amount }
  }).save()
  .then(()=>
  message.channel.send(
   new MessageEmbed().setDescription(
       '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
       + `Registered! 💰**${amount}** coins were added to your account!
       \nTo check your balance, type \`${client.config.prefix}bal\``
     ).setColor('GREEN')
   )
  )
  .catch(()=>
    message.channel.send(
      new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
      `).setColor('RED')
    )
  )

  }
}
