const { MongooseModels: { guildProfileSchema }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'setgoodbyech',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up the goodbye channel',
  examples: ['setgoodbyech #general'],
  parameters: ['Channel ID, Channel Mention'],
  run: async (client, message) => {

    const channelID = message.content.match(/\d{17,19}/)

    if (!channelID)
    return message.channel.send(
      new MessageEmbed().setDescription(
        '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + `**${message.member.displayName}**, please provide a valid channel ID or channel mention`
        + '\n\nYou can either mention the channel or just provide the channel ID.'
      ).setColor('RED')
      .setFooter(
        `${client.guildsettings.get(message.guild.id).goodbye.channel
        ? client.channels.cache.get(client.guildsettings.get(message.guild.id).goodbye.channel)
          ? `The goodbye channel is currently set to #${
            message.guild.channels.cache.get(client.guildsettings.get(message.guild.id).goodbye.channel).name
          }`
          : `The goodbye channel has been set but was deleted.`
        : 'The goodbye channel for this guild is still unconfigured.'} | ©️2020 Mai`
      )
    )

    const channel = message.guild.channels.cache.get(channelID[0])

    if (!channel || channel.type !== 'text')
    return message.channel.send(
      new MessageEmbed().setDescription(
        '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + `**${message.member.displayName}**, the supplied channel id is not valid.`
        + '\n\nPlease make sure that the channel ID is a valid channel id, and is it is of type `text`'
      ).setColor('RED')
      .setFooter(
        `${client.guildsettings.get(message.guild.id).goodbye.channel
        ? client.channels.cache.get(client.guildsettings.get(message.guild.id).goodbye.channel)
          ? `The goodbye channel is currently set to #${
            message.guild.channels.cache.get(client.guildsettings.get(message.guild.id).goodbye.channel).name
          }`
          : `The goodbye channel has been set but was deleted.`
        : 'The goodbye channel for this guild is still unconfigured.'} | ©️2020 Mai`
      )
    )

    if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES'))
    return message.channel.send(
      new MessageEmbed().setDescription(
        '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + `**${message.member.displayName}**, I cannot type anything in ${channel}.`
        + '\n\nPlease adjust the necessary permissions for me on that channel and try again.'
      ).setColor('RED')
      .setFooter(
        `${client.guildsettings.get(message.guild.id).goodbye.channel
        ? client.channels.cache.get(client.guildsettings.get(message.guild.id).goodbye.channel)
          ? `The goodbye channel is currently set to #${
            message.guild.channels.cache.get(client.guildsettings.get(message.guild.id).goodbye.channel).name
          }`
          : `The goodbye channel has been set but was deleted.`
        : 'The goodbye channel for this guild is still unconfigured.'} | ©️2020 Mai`
      )
    )

    let data = await guildProfileSchema.findOne({
      guildID: message.guild.id
    }).catch(() => null)
    || await new guildProfileSchema({
      guildID: message.guild.id
    }).save().catch(err => err)

    if (data instanceof MongooseError)
    return message.channel.send(
      new MessageEmbed().setDescription(
          '<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      ).setColor('RED')
    )

    data.goodbyeChannel = channel.id

    return data.save()
    .then(data => {
      client.guildsettings.get(message.guild.id).goodbye.channel = data.goodbyeChannel
      return message.channel.send(
       new MessageEmbed().setDescription(
           '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
           + `Successfully set the goodbye channel to ${channel}!
           \nTo disable this feature, use the \`${client.config.prefix}goodbyetoggle\` command.`
         ).setColor('GREEN')
       )
    }).catch(()=>
    message.channel.send(
      new MessageEmbed().setDescription(
        `<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
      `).setColor('RED')
    )
  )

  }
}
