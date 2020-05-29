const { MessageEmbed } = require('discord.js')
const guildData = require('../../models/guildProfileSchema.js')

module.exports = {
  config: {
    name: 'setmute',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: true,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'setup',
    description: `Setup the mute role.`,
    examples: ['setmute muted'],
    parameters: ['Role ID', 'Role Mention', 'Role Name']
  },
  run: async ( { guildsettings }, message, [ role ]) => {

    if (!role) {

      const g = guildsettings.get(message.guild.id)

      if (!g || !g.muterole) return message.channel.send(error('Muterole not set!'))

      const muterole = message.guild.roles.cache.get(g.muterole)

      if (!muterole) return message.channel.send(error('The Previous Muterole was deleted! Please set a new one!'))

      return message.channel.send(`The current mute role is ${muterole}`)

    }

    role = message.mentions.roles.size ? message.mentions.roles.first() : message.guild.roles.cache.get(role) || message.guild.roles.cache.find(r => r.name === role)

    if (!role) return message.channel.send(error('Invalid Role. Please Mention the role or supply the Role ID or the Role Name.'))

    let data = await guildData.findOne({guildID: message.guild.id}).catch(()=>{})

    if (data === undefined) return message.channel.send(error('Could not connect to database'))

    if (data === null) data = await new guildData({guildID: message.guild.id}).save()

    const g = guildsettings.get(message.guild.id) || guildsettings.set(message.guild.id, data).get(message.guild.id)

    data.muterole = role.id
    g.muterole = role.id

    await data.save()

    return message.channel.send(`Mute role is now set to ${role}`)

  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
