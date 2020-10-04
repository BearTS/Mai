const { MongooseModels: model, TextHelpers: { commatize } } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'bank',
  aliases: ['regbank'],
  guildOnly: true,
  economycommand: true,
  group: 'economy',
  clientPermissions: ['EMBED_LINKS'],
  description: 'Your wallet can\'t keep all your coins! So how about opening a bank account?',
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
        '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  if (!data)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000**${message.member.displayName}**, Bank requires coins to register, but you don't have a **wallet** yet!
        \nTo create one, type \`${client.config.prefix}register\`.`
    ).setColor('RED')
  )

  if (data.data.bank || data.data.bank === 0)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000**${message.member.displayName}**, You already have a bank account.
        \nTo check what you can do with your coins, type \`${client.config.prefix}cmd economy\`.
    `).setColor('RED')
  )

  if (data.data.wallet < 2500)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000**${message.member.displayName}**, it seems like you don't have enough coins to register in a bank (***${commatize(2500 - data.data.wallet)}** more coins are needed*).
        Earn more coins first.
        \nTo view how you can earn points, type \`${client.config.prefix}cmd economy\`.
    `).setColor('RED')
  )

  data.data.wallet = data.data.wallet - 2500
  data.data.bank = 2500

  return data.save().then(() =>
   message.channel.send(
    new MessageEmbed().setDescription(
        '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
        + `Registered to a bank! The **2,500** fee was transferred to your bank.
        \nTo check your balance, type \`${client.config.prefix}bal\``
      ).setColor('GREEN')
    )
  ).catch(() =>
    message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
      `).setColor('RED')
    )
  )

  }
}
