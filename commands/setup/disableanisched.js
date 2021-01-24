const { MongooseModels: model } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'disableanisched',
  aliases: ['anischedoff'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Disable the anisched feature for this server',
  examples: [],
  parameters: [],
  run: async (client, message) => {

  let data = await model.guildWatchlistSchema.findOne({
    guildID: message.guild.id
  }).catch(err => err)

  if (!data) data = await new model.guildWatchlistSchema({
    guildID: message.guild.id
  }).save().catch(err => err)

  if (data instanceof MongooseError)
  return message.channel.send(
    embed.setDescription(
      `**${message.member.displayName}**, I am unable to contact the database.\n\n`
      + `Please try again later or report this incident to my developer.`
    ).setAuthor('Database Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    .setFooter(`Disable Anisched | \©️${new Date().getFullYear()} Mai`)
  )

  if (!data.channelID)
  return message.channel.send(
    embed.setDescription(
      `**${message.member.displayName}**, Anisched is already disabled here.\n\n`
      + `You can reenable this feature by setting the anischedule channel.`
    ).setAuthor('Database Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    .setFooter(`Disable Anisched | \©️${new Date().getFullYear()} Mai`)
  )

  data.channelID = null

  return data.save()
    .then(()=>{
      client.guildsettings.profiles.get(message.guild.id).featuredChannels.anisched = null
      message.channel.send('Successfully disabled the Anisched Feature')
    })
      .catch(()=> message.channel.send('<:cancel:767062250279927818> | There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.'))

  }
}
