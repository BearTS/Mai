const { MongooseModels: model, TextHelpers: { commatize } } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
  name: 'daily',
  aliases: [],
  guildOnly: true,
  group: 'economy',
  clientPermissions: ['EMBED_LINKS'],
  description: 'Retrieve your daily reward <3',
  examples: [],
  parameters: [],
  run: async (client, message) => {

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
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000`
        + `**${message.member.displayName}**, You don't have a **wallet** yet!
        \nTo create one, type \`${client.config.prefix}register\`.
        \u2000\u2000`
    ).setColor('RED')
  )

  const now = Date.now()
  const previousStreak = data.daily.streak
  let overflow = false
  let excess = null

  if (data.daily.timestamp !== 0 && data.daily.timestamp - now > 0)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000`
        + `You already got your daily reward!
        \nYou can get your next daily reward in ${
          moment.duration(data.daily.timestamp - now, 'milliseconds').format('H [hour,] m [minute, and] s [second]')
        }`
    ).setColor('RED')
  )

  if (data.daily.timestamp + 86400000 < now )
  data.daily.streak = 0

  data.daily.streak++

  data.daily.timestamp = now + 86400000

  let amount = 500 + 50 * (data.daily.streak < 30 ? data.daily.streak : 30 )

  if (data.data.wallet + amount > 20000){
    overflow = true
    excess = data.data.wallet + amount - 20000
  }

  data.data.wallet = overflow ? 20000 : data.data.wallet + amount

  data.save().then(()=>

    message.channel.send(
      new MessageEmbed().setDescription(`
        **${message.member.displayName}**, you received **${commatize(amount)}** coins from daily rewards${
          overflow
          ? ` but your wallet just overflowed. Instead of receiving the full amount, you'd only get **${
            commatize(amount - excess)
          }**(${
            excess
          } less) from me.`
          : '!'
        }
        To check your balance, type \`${client.config.prefix}bal\`
        \n${
          data.daily.timestamp + 86400000 < now
          ? `Oh no! You have not been able to claim yesterday's daily goods and lost your \`${previousStreak}x\` streak. Your streak will now be reset.\n`
          : ''
        }Streak: **${data.daily.streak}**x
      `).setColor('GREEN')
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
