const { MongooseModels: model, TextHelpers: { commatize } } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'transfer',
  aliases: ['give'],
  guildOnly: true,
  group: 'economy',
  clientPermissions: ['EMBED_LINKS'],
  description: 'Give some of your coins to your friends!',
  examples: ['transfer @user 500'],
  parameters: ['User Mention'],
  run: async (client, message, [friend = '', amount]) => {

  if (!client.guildsettings.get(message.guild.id).isEconomyActive)
  return message.channel.send(
    new MessageEmbed().setDescription(`
        \u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000Economy has been **Disabled** for this server.
        \nIf you are a server administrator, you may reenable it by typing \`${client.config.prefix}economytoggle\` command
    `).setColor('RED')
  )

  friend = friend.match(/\d{17,19}/) ? friend.match(/\d{17,19}/)[0] : null
  friend = message.guild.members.cache.get(friend)

  if (!friend || friend.user.bot)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, I can't find your friend in this server.

        ${friend && friend.user.bot
          ? 'Surely, you aren\'t attempting to transfer your coins to **a bot** aren\'t you?'
          : ''
        }`
    ).setColor('RED')
  )

  let sender = await model.bankSchema.findOne({
    guildID: message.guild.id,
    userID: message.author.id
  }).catch(err => err)

  let recepient = await model.bankSchema.findOne({
    guildID: message.guild.id,
    userID: friend.user.id
  }).catch(err => err)

  if (sender instanceof MongooseError || recepient instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  if (!sender || !recepient || sender.data.bank !== 0 || recepient.data.bank !== 0)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
      + `${message.member.displayName}, ${
          sender
          ? sender.data.bank || sender.data.bank === 0
            ? `**${friend.displayName}** doesn't`
            : 'You don\'t'
          : `You don't`
        } have a **bank** yet! Transferring coins requires bank.
        \nTo create one, type \`${client.config.prefix}regbank\`.`
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
        + `${message.member.displayName}, The amount to be transferred must be at least **100**.`
    ).setColor('RED')
  )

  if (Math.floor(amount * 1.1) > sender.data.bank)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, You don't have enough coins in your bank to proceed with the transaction.
        \nYou only have **${commatize(sender.data.wallet)}**, ${commatize((amount - sender.data.wallet) + Math.floor(amount * 0.1))} less than the amount you want to transfer (Transaction fee of 10% included).
        `
    ).setColor('RED')
  )

  sender.data.bank = sender.data.bank - amount * 1.1
  recepient.data.bank = recepient.data.bank + amount

  sender.save().then(
    recepient.save().then(
      new MessageEmbed().setDescription(
        '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
        + `**${message.member.displayName}**, You successfully transferred **${commatize(amount)}** coins to **${friend.displayAvatarURL}**'s bank!
        \nYou also paid **${Math.floor(amount * 0.1)}** (10%) for the transaction fee.`
      ).setColor('GREEN')
    )
    ).catch(()=>
    message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Transferred amount was lost on the void. Please try again later.
      `).setColor('RED')
      )
    ).catch(()=>
    message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Transaction was cancelled. Please try again later.
      `).setColor('RED')
      )
    )


  }
}
