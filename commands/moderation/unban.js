module.exports = {
  name: 'unban',
  aliases: [],
  guildOnly: true,
  permissions: ['BAN_MEMBERS'],
  clientPermissions: ['BAN_MEMBERS'],
  group: 'moderation',
  description: 'unbans a user from this server',
  examples: ['ban 0123456789012345678'],
  parameters: ['user ID'],
  run: async (client, message, [ mention, ...reason]) => {

    if (!mention || !mention.match(/\d{17,19}/))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please supply the ID of the user to unban.`)

    let user = await client.users.fetch(mention.match(/\d{17,19}/)[0]).catch(()=>null)

    if (!user)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Invalid user ID. Please supply a valid Discord User ID.`)

    if (user.id === message.author.id)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, You can't possibly be banned here!`)

    if (user.id === client.user.id)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Im not banned here.`)

    if (user.id === message.guild.ownerID)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, A server owner cannot be banned in the first place!`)

    reason = reason.length ? reason.join(' ') : 'None'

    message.guild.members.unban(user, { reason:  `MAI_SOFT_BANS: ${message.author.tag}: ${reason}` })
      .then(()=> message.channel.send(`Successfully unbanned **${user.tag}**! (${user.id})${user.bot ? ' **(BOT)**':''}`))
        .catch(()=> message.channel.send(`<:cancel:767062250279927818> | ${message.author}, **${user.tag}** (${user.id}) is not banned from this server!`))

  }
}
