const { MongooseModels: model } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'userxpreset',
  aliases: ['resetuserxp','resetxpuser'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Reset the xp of a particular user in this server.',
  examples: [],
  parameters: [],
  run: async (client, message) => {

    const match = message.content.match(/\d{17,19}/) || ['undefined'];

    let member = await message.guild.members.fetch(match[0]).catch(()=> null)

    if (!member)
    return message.channel.send(
      new MessageEmbed().setDescription(
        '\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + 'Couldn\'t find that member in this server!'
      ).setColor('RED')
    )

    if (member.user.bot)
    return message.channel.send(
      new MessageEmbed().setDescription(
        '\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + 'A bot cannot earn experience points!'
      ).setColor('RED')
    )

  await message.channel.send(`This will **reset** **${member.displayName}**\'s experience points in this server (Action irreversible). Continue?`)
  collector = message.channel.createMessageCollector( res => message.author.id === res.author.id )

  const continued = await new Promise( resolve => {
    const timeout = setTimeout(()=> collector.stop('TIMEOUT'), 30000)
    collector.on('collect', (message) => {
      if (['y','yes'].includes(message.content.toLowerCase())) return resolve(true)
      if (['n','no'].includes(message.content.toLowerCase())) return resolve(false)
    })
    collector.on('end', () => resolve(false))
  })

  if (!continued)
    return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, cancelled the userxpreset command!`)

  const data = await model.xpSchema.findOne({ guildID: message.guild.id, userID: member.id})

  if (!data)
  return message.channel.send(
    new MessageEmbed().setColor('RED')
    .setDescription(
      '\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
      + `**${member.displayName}** has not started earning experience points!`
    )
  )

  if (data instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setColor('RED')
      .setDescription(
        '\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
    )
  )

  return data.remove().then(()=>
    message.channel.send(
      new MessageEmbed().setColor('GREEN')
      .setDescription(
        '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
        + `**${member.displayName}**'s experience points has been **reset**.`
      )
    )
  ).catch(()=>
  message.channel.send(
    new MessageEmbed().setColor('GREEN')
    .setDescription(
      '\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
      + `**${member.displayName}**'s experience points **reset attempt** has failed.`
      )
    )
  )
  }
}
