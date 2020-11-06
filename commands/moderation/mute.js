require('moment-duration-format')
const { duration } = require('moment')

module.exports = {
  name: 'mute',
  aliases: ['deafen', 'silence', 'shut'],
  guildOnly: true,
  permissions: ['MANAGE_ROLES','KICK_MEMBERS'],
  clientPermissions: ['MANAGE_ROLES','KICK_MEMBERS'],
  group: 'moderation',
  description: 'Prevent a user from sending a message in the server.',
  examples: ['mute [user] [time]'],
  parameters: ['user mention','time'],
  run: async (client, message, [ member ]) => {

    const mute = client.guildsettings.has(message.guild.id) ? message.guild.roles.cache.get(client.guildsettings.get(message.guild.id).roles.muted) : undefined

    if (!mute)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Muterole has not yet been set! Do so by using \`setmute\` command.`)


    if (!member || !member.match(/\d{17,19}/))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please supply the ID or mention the member to mute!`)

    member = await message.guild.members.fetch(member.match(/\d{17,19}/)[0]).catch(()=>null)

    if (!member)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, cannot mute an invalid user!`)

    if (message.member.roles.highest.position < member.roles.highest.position)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, you cannot mute user whose roles are higher than yours!`)

    if (member.id === client.user.id)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, no don't mute me!`)

    if (member.user.bot)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, you cannot mute bots!`)

    if (message.member.id === member.id)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, you cannot mute yourself!`)

    if (member.roles.cache.has(mute.id))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, **${member.user.tag}** is already muted!`)

    return member.roles.add(mute)
      .then((member) => {

        return message.channel.send(`Successfully Muted **${member.user.tag}**`)

      }).catch(() => message.channel.send(`<:cancel:767062250279927818> | ${message.author}, I'm unable to mute **${member.user.tag}**. Make sure the muterole is at least below my highest role`))

  }
}
