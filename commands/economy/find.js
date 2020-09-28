const { MongooseModels: model, TextHelpers: { commatize } } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed, Collection } = require('discord.js')
const moment = require('moment')
const location = [ "under the couch", "above the desk", "in the Living Room", "in Sakuta's bedroom", "under the rug", "beside the window", "in my bedroom", "in Nodoka's bedroom", "in Rio's bedroom", "under the desk", "the bookshelves", "the cabinet"]


module.exports = {
  name: 'find',
  aliases: ['search'],
  guildOnly: true,
  group: 'economy',
  clientPermissions: ['EMBED_LINKS'],
  description: 'Want to earn money some more? Why don\'t you try begging, maybe someone will give you.',
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
        `\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000
        ${message.member.displayName}, You don't have a **wallet** yet! To create one, type \`${client.config.prefix}register\`.
        \u2000\u2000\n\n\u200b`
    ).setColor('RED')
  )

  const now = Date.now()
  const duration = Math.floor(Math.random() * 1000 * 60 * 60 * 2) + 60000 * 60
  const beg = client.collections.economy.get('find') || client.collections.economy.set('find', new Collection()).get('find')
  const userprofile = beg.get(message.author.id) || beg.set(message.author.id, new Collection()).get(message.author.id)
  const guilduser = userprofile.get(message.guild.id)
  let overflow = false
  let excess = null

  if (guilduser > now)
  return message.channel.send(
    new MessageEmbed().setDescription(
        `**${message.member.displayName}** searched **${
          location[Math.floor(Math.random() * location.length)]
        }**, but found nothing.
        \nTo view other ways to earn points, type \`${client.config.prefix}cmd economy\`.
    `).setColor('RED')
  )

  userprofile.delete(message.guild.id)
  userprofile.set(message.guild.id, (now + duration))

  let amount = Math.floor(Math.random() * 200) + 100

  if (data.data.wallet + amount > 20000){
    overflow = true
    excess = data.data.wallet + amount - 20000
  }

  data.data.wallet = overflow ? 20000 : data.data.wallet + amount

  return data.save().then(()=>
    message.channel.send(
      new MessageEmbed().setDescription(`
        **${message.member.displayName}** searched **${
          location[Math.floor(Math.random() * location.length)]
        }**, and found **${amount}**!!${
            overflow
            ? ` But your wallet just overflowed. Instead of receiving the full amount, you'd only get **${
              commatize(amount - excess)
            }** (${
              excess
            } less) from me.`
            : ''
          }
          \nTo check your balance, type \`${client.config.prefix}bal\`
          Keep your wallet from overflowing by depositing some of your coins to the bank.
      `).setColor('GREY')
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
