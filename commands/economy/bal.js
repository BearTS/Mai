const { MongooseModels: model, TextHelpers: { commatize } } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'bal',
  aliases: ['balance','credits'],
  guildOnly: true,
  economycommand: true,
  group: 'economy',
  clientPermissions: ['EMBED_LINKS'],
  description: 'Check your wallet, how much have you earned?',
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
        '\u200b\n\n\u2000\u2000<:cancel:767062250279927818>|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  if (!data)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
      + `${message.member.displayName}, You don't have a **wallet** yet! To create one, type \`${client.config.prefix}register\`.`
    ).setColor('RED')
  )

  return message.channel.send(
    new MessageEmbed().setDescription(
      `\u200B\n💰 **${
        commatize(data.data.wallet)
      }** coins in posession.\n\n${
        data.data.bank !== null
        ? `💰 **${commatize(data.data.bank)}** coins in bank!`
        : `Seems like you don't have a bank yet. Create one now by typing \`${
          client.config.prefix
        }bank\``
      }`
    ).setAuthor(`${message.member.displayName}'s wallet`)
    .setColor('GREY')
    .setThumbnail(message.author.displayAvatarURL({dynamic: 'true'}))
  )

  }
}
