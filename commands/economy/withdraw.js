const { MongooseModels: model, TextHelpers: { commatize } } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed, Collection } = require('discord.js')
const moment = require('moment')

module.exports = {
  name: 'withdraw',
  aliases: [],
  guildOnly: true,
  group: 'economy',
  clientPermissions: ['EMBED_LINKS'],
  description: 'Withdraw some of your money from the bank.',
  examples: [],
  parameters: [],
  run: async (client, message, [amount]) => {

  if (!client.guildsettings.get(message.guild.id).isEconomyActive)
  return message.channel.send(
    new MessageEmbed().setDescription(`
        \u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000Economy has been **Disabled** for this server.
        \nIf you are a server administrator, you may reenable it by typing \`${client.config.prefix}economytoggle\` command
    `).setColor('RED')
  )

  let data = await model.bankSchema.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  }).catch(err => err)

  if (data instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  if (!data)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000
        ${message.member.displayName}, You don't have a **wallet** yet! You can't withdraw something you don't have.\n
        To create one, type \`${client.config.prefix}register\`.`
    ).setColor('RED')
  )

  if (data.data.bank === null)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, You don't have a **bank** yet! You need a bank to to withdraw your coins from!
        \n Get a bank first by typing \`${client.config.prefix}bank\`. You must have at least **2,500** coins to register to a bank!`
    ).setColor('RED')
  )

  amount = parseInt(amount)

  if (!amount || isNaN(amount) || amount < 1)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, Please enter a valid amount.`
    ).setColor('RED')
  )

  if (amount < 100)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, The amount to be withdrawn must be at least **100**.`
    ).setColor('RED')
  )

  if (Math.floor(amount * 1.05) > data.data.bank)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, You don't have enough coins in your wallet to proceed with the transaction.
        You only have **${commatize(data.data.bank)}**, ${commatize((amount - data.data.bank) + Math.floor(amount * 0.05))} less than the amount you want to withdraw. (Transaction fee of 5% included).`
    ).setColor('RED')
  )

  if (data.data.wallet + amount > 20000)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, The amount to be withdrawn + your current wallet balance exceeds your wallet capacity.

        The maximum amount to be withdrawn without causing a wallet overflow is **${commatize(20000 - data.data.wallet)}** coins.`
    ).setColor('RED')
  )

  data.data.wallet = data.data.wallet + parseInt(amount)
  data.data.bank = data.data.bank - Math.floor(amount * 1.05)

  if (data.data.wallet > 20000)
  data.data.wallet = 20000

  return data.save().then(()=>

  message.channel.send(
    new MessageEmbed().setDescription(
      '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
      + `**${message.member.displayName}**, You successfully withdrawn **${commatize(amount)}** coins from your bank!
      \nYou also paid **${Math.floor(amount * 0.05)}** (5%) for the transaction fee.`
    ).setColor('GREEN')
  )
).catch(()=>

message.channel.send(
  new MessageEmbed().setDescription(
      `\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
    `).setColor('RED')
)

)

  }
}
