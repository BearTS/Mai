const { MongooseModels: { guildProfileSchema }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'setmute',
  aliases: ['setmuterole'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up the mute role.',
  examples: ['setmute muted'],
  parameters: ['Role ID', 'Role Mention', 'Role Name'],
  run: async ( client, message, [ role ] ) => {

    if (!role) {

      const guildsetting = client.guildsettings.get(message.guild.id)

      if (!guildsetting || !guildsetting.roles || !guildsetting.roles.muted) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Muterole not set!`)

      const muterole = message.guild.roles.cache.get(guildsetting.roles.muted)

      if (!muterole) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, The previous Muterole was either removed or deleted.`)

      return message.channel.send(`The current muterole is ${muterole}`)
    }

  role = message.mentions.roles.size ? message.mentions.roles.first() : message.guild.roles.cache.get(role) || message.guild.roles.cache.find( r => r.name === role)

  if (!role)
    return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Invalid Role - Please supply the mention of the role, the ID of the role, or its Role Name.`)

  let data = await guildProfileSchema.findOne({
    guildID: message.guild.id
  }).catch((err)=> err)

  if (!data) data = await new guildData({
    guildID: message.guild.id
  }).save()
      .catch((err)=> err)

  if (data instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    )
  )

  data.muterole = role.id

  client.guildsettings.get(message.guild.id) || guildsettings.set(message.guild.id, data).get(message.guild.id)

  return data.save()
    .then((data)=>{
      client.guildsettings.get(message.guild.id).roles.muted = data.muterole
      return message.channel.send(`Successfully set the mutrole to ${role}!`)
    }).catch(()=> message.channel.send(`<:cancel:712586986216489011> | ${message.author}, There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.`))

  }
}
