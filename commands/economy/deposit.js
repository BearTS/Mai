const { MongooseModels: model, TextHelpers: { commatize } } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed, Collection } = require('discord.js')
const moment = require('moment')

module.exports = {
  name: 'deposit',
  aliases: ['dep'],
  guildOnly: true,
  economycommand: true,
  group: 'economy',
  clientPermissions: ['EMBED_LINKS'],
  description: 'Deposit your money in a bank to safeguard your money!',
  examples: [],
  parameters: [],
  run: async (client, message, [amount]) => {

  let data = await model.bankSchema.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  }).catch(err => err)

  if (data instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u200b\n\n\u2000\u2000<:cancel:767062250279927818>|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  if (!data)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000
        ${message.member.displayName}, You don't have a **wallet** yet! To create one, type \`${client.config.prefix}register\`.`
    ).setColor('RED')
  )

  if (data.data.bank === null)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, You don't have a **bank** yet! You need a bank to deposit your coins!
        \n Get a bank first by typing \`${client.config.prefix}bank\`. You must have at least **2,500** coins to register to a bank!`
    ).setColor('RED')
  )

  amount = amount === 'all' ? Math.floor(data.data.wallet * 0.95) : parseInt(amount)

  if (!amount || isNaN(amount) || amount < 1)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, Please enter a valid amount.`
    ).setColor('RED')
  )

  if (amount < 100)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, The amount to be deposited must be at least **100**.`
    ).setColor('RED')
  )

  if (Math.floor(amount * 1.05) > data.data.wallet)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, You don't have enough coins in your wallet to proceed with the transaction.
        You only have **${commatize(data.data.wallet)}**, ${commatize((amount - data.data.wallet) + Math.floor(amount * 0.05))} less than the amount you want to deposit (Transaction fee of 5% included).
        \nTo deposit all coins, type \`${client.config.prefix}deposit all\`
        `
    ).setColor('RED')
  )

  data.data.bank = data.data.bank + parseInt(amount)
  data.data.wallet = data.data.wallet - Math.floor(amount * 1.05)

  return data.save().then(()=>

  message.channel.send(
    new MessageEmbed().setDescription(
      '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
    + `**${message.member.displayName}**, You successfully deposited **${commatize(amount)}** coins to your bank!
      \nYou also paid **${Math.floor(amount * 0.05)}** (5%) for the transaction fee.`
    ).setColor('GREEN')
  )
).catch(()=>

message.channel.send(
  new MessageEmbed().setDescription(
      `\u2000\u2000<:cancel:767062250279927818>|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
    `).setColor('RED')
)

)

  }
}
