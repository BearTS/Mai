const { MongooseModels: model, TextHelpers: { commatize } } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'bet',
  aliases: ['gamble'],
  guildOnly: true,
  economycommand: true,
  group: 'economy',
  clientPermissions: ['EMBED_LINKS'],
  description: 'Check your wallet, how much have you earned?',
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
        '\u200b\n\n\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  if (!data)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `**${message.member.displayName}**, You don't have a **wallet** yet!
        \nTo create one, type \`${client.config.prefix}register\`.
        \u2000\u2000`
    ).setColor('RED')
  )

  if (data.data.bank === null)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, You don't have a **bank** yet! Won bets might be higher than wallet capacity depending on your bet amount
        \n Get a bank first by typing \`${client.config.prefix}bank\`. You must have at least **2,500** coins to register to a bank!`
    ).setColor('RED')
  )

  if (!amount || isNaN(amount))
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, Please enter a valid amount.
        \nBets must be greater than **499** coins but less than **5,001**`
    ).setColor('RED')
  )

  if (amount < 500)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, That amount is too low for a bet.
        \nBets must be greater than **499** coins but less than **5,001**`
    ).setColor('RED')
  )

  if (amount > 5000)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, That amount is too large for a bet.
        \nBets must be greater than **499** coins but less than **5,001**`
    ).setColor('RED')
  )

  if (amount > data.data.wallet)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000`
        + `${message.member.displayName}, You don't have enough coins in your wallet to proceed with that bet.
        \nGet more coins from your bank by typing \`${client.config.prefix}withdraw\`.`
    ).setColor('RED')
  )

  data.data.wallet = data.data.wallet - Math.floor(amount)

  return data.save().then(() =>
    message.channel.send(
      new MessageEmbed().setDescription(
        `**${message.member.displayName}**, Your **${Math.floor(amount)}** bet has been placed. Please wait 1 minute for the result.
        \nOdds for winning the bet is 1/3, and amount won are twice as large up to 10x as large as the original bet!`
      ).setColor('YELLOW')
    ).then(()=>
      setTimeout(()=>{

        const won = Math.floor(Math.random()*4) === 2 ? true : false

        if (!won)
        return message.channel.send(
          message.author.toString(),
          new MessageEmbed().setDescription(
              `${message.member.displayName}, You lost **${commatize(amount)}** coins from your previous bet.
              \nYou can also get reliable coins without using the bet command!`
          ).setColor('RED')
        )

        const multiplier = parseInt(Math.random() * 8) + 2

        prize = amount * multiplier

        data.data.bank = data.data.bank + prize

        return data.save().then(()=>

        message.channel.send(
          message.author.toString(),
          new MessageEmbed().setDescription(
            `**${message.member.displayName}**, You just won your previous bet!!!
            \nYour bet **${Math.floor(amount)}** coins have multiplied by \`${multiplier}x\`
            You'll receive **${commatize(prize)}** coins as the prize. Your winnings has been transferred to your bank!`
          ).setColor('GREEN')

        ).catch(()=>

        message.channel.send(
          message.author.toString(),
          new MessageEmbed().setDescription(
              `Oh no! ${message.member.displayName}, The betting machine just broke! You lost **${commatize(amount)}** coins from your previous bet.
              \nThis doesn't usually happen. Please contact my developer if you receive this message`
          ).setColor('RED')
          )
        ))

      }, 60000)
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
