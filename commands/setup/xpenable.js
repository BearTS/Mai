const { MongooseModels: model } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'xpenable',
  aliases: ['enablexp', 'enablexpon', 'xpenableon'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Enable collecting xp on **Disabled** mentioned channels',
  examples: [],
  parameters: [],
  run: async (client, message) => {

  const channels = message.mentions.channels.map( c => c.id)

  if (!channels.length)
  return message.channel.send(
      new MessageEmbed().setDescription(
          '\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + 'Please mention the channel(s) you want me to collect xp from.'
      ).setColor('RED')
    )

  let data = await model.guildProfileSchema.findOne({
    guildID: message.guild.id
  }).catch(err => err)

  if (!data) data = await new model.guildProfileSchema({
    guildID: message.guild.id
  }).save().catch(err => err)

  if (data instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u200b\n\n\u2000\u2000<:cancel:767062250279927818>|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  const nonavail = []
  const avail = []

  for (const channelID of channels) {
    if (data.xpExceptions.includes(channelID)){
      avail.push(channelID)
    } else {
      nonavail.push(channelID)
    }
  }

  if (!avail.length)
  return message.channel.send(
      new MessageEmbed().setDescription(
          '\u2000\u2000<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000'
        + 'The mentioned channel(s) '
        + nonavail.map(c => client.channels.cache.get(c).toString().toString()).join(', ')
        + ' are not on the excempt list. Xp System is still **enabled** there.'
      ).setColor('RED')
    )

  for (const channel of avail){
    data.xpExceptions.splice(data.xpExceptions.indexOf(channel), 1)
  }

  data.save()
  .then(()=>{
    client.guildsettings.profiles.get(message.guild.id).xp.exceptions = data.xpExceptions
    return message.channel.send(
      new MessageEmbed().setDescription(
          '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
        + 'XP [Experience Points System] have been reenabled on '
        + avail.map(c => client.channels.cache.get(c).toString()).join(', ')
        + `${nonavail.length ? `\n\n⚠️\u2000\u2000|\u2000\u2000${nonavail.map(c => client.channels.cache.get(c).toString()).join(', ')} are not on excempted list.` : '' }`
        + `\n\nTo see which channels do not give xp, use the command \`${client.config.prefix}nonxpchannels\``
      ).setColor('GREEN')
    )
  })
  .catch((err)=> message.channel.send('<:cancel:767062250279927818> | There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.')
)

  }
}
