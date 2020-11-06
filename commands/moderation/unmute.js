require('moment-duration-format')
const { duration } = require('moment')

module.exports = {
  name: 'unmute',
  aliases: ['undeafen','speak'],
  guildOnly: true,
  permissions: ['MANAGE_ROLES','KICK_MEMBERS'],
  clientPermissions: ['MANAGE_ROLES','KICK_MEMBERS'],
  group: 'moderation',
  description: 'Unmutes a muted user from this server .',
  examples: ['umute [user]'],
  parameters: ['user mention'],
  run: async (client, message, [ member ]) => {

    const mute = client.guildsettings.has(message.guild.id) ? message.guild.roles.cache.get(client.guildsettings.get(message.guild.id).roles.muted) : undefined

    if (!mute)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Muterole has not yet been set! Do so by using \`setmute\` command.`)

    if (!member || !member.match(/\d{17,19}/))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please supply the ID or mention the member to unmute!`)

    member = await message.guild.members.fetch(member.match(/\d{17,19}/)[0]).catch(()=>null)

    if (!member)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, cannot unmute an invalid user!`)

    if (!member.roles.cache.has(mute.id))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, **${member.user.tag}** is not muted!`)

    return member.roles.remove(mute)
      .then((member) => message.channel.send(`**${member.user.tag}** has been unmuted!`))
        .catch(() => message.channel.send(`<:cancel:767062250279927818> | ${message.author}, I'm unable to unmute **${member.user.tag}**`))

  }
}
