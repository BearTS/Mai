const { MongooseModels: model } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'xpexcempt',
  aliases: ['excemptxp', 'disablexpon', 'xpdisableon'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Disable collecting xp on mentioned channels',
  examples: [],
  parameters: [],
  run: async (client, message) => {

  const channels = message.mentions.channels.map( c => c.id)

  if (!channels.length)
  return message.channel.send(
      new MessageEmbed().setDescription(
          '\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
        + 'Please mention the channel(s) you want me to not collect xp from.'
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
        '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  const newch = []
  const oldch = []

  for (const channelID of channels) {
    if (data.xpExceptions.includes(channelID)){
      oldch.push(channelID)
    } else {
      newch.push(channelID)
    }
  }

  if (!newch.length)
  return message.channel.send(
      new MessageEmbed().setDescription(
          '\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
        + 'The mentioned channel(s) '
        + oldch.map(c => client.channels.cache.get(c).toString().toString()).join(', ')
        + ' are already in the excempt list.'
      ).setColor('RED')
    )

  for (const channel of newch){
    data.xpExceptions.push(channel)
  }


  data.save()
  .then(()=>{
    client.guildsettings.profiles.get(message.guild.id).xp.exceptions = data.xpExceptions
    return message.channel.send(
      new MessageEmbed().setDescription(
          '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
        + 'XP [Experience Points System] will now be disabled on '
        + newch.map(c => client.channels.cache.get(c).toString()).join(', ')
        + `${oldch.length ? `\n\n⚠️\u2000\u2000|\u2000\u2000${oldch.map(c => client.channels.cache.get(c).toString()).join(', ')} are already on excempted list.` : '' }`
        + '\n\nTo see which channels do not give xp, use the command \`nonxpchannels\`'
      ).setColor('GREEN')
    )
  })
  .catch((err)=> message.channel.send('<:cancel:712586986216489011> | There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.')
)

  }
}
