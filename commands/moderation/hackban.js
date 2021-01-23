module.exports = {
  name: 'hackban',
  aliases: [],
  guildOnly: true,
  permissions: ['BAN_MEMBERS'],
  clientPermissions: ['BAN_MEMBERS'],
  group: 'moderation',
  description: 'bans a user, whether or not they are in the server.',
  examples: ['hackban 0123456789012345678'],
  parameters: ['user ID'],
  run: async (client, message, [ mention, ...reason]) => {

    if (!mention || !mention.match(/\d{17,19}/))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please supply the ID of the user to ban.`)

    let user = await client.users.fetch(mention.match(/\d{17,19}/)[0]).catch(()=>null)

    if (!user)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Invalid user ID. Please supply a valid Discord User ID.`)

    if (user.id === message.author.id)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, You cannot ban yourself!`)

    if (user.id === client.user.id)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please don't ban me!`)

    if (user.id === message.guild.ownerID)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, You cannot ban a server owner!`)

    if (client.config.owners.includes(user.id))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, No, you can't ban my developers through me!`)


    reason = reason.length ? reason.join(' ') : 'None'

    message.guild.members.ban(user, { reason:  `MAI_HACK_BANS: ${message.author.tag}: ${reason}` })
      .then(()=> message.channel.send(`Successfully hackbanned **${user.tag}**! (${user.id})${user.bot ? ' **(BOT)**':''}`))
        .catch(()=> message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Unable to hackban **${user.tag}**! (${user.id})`))

  }
}
