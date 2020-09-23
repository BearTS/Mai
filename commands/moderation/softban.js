module.exports = {
  name: 'softban',
  aliases: [],
  guildOnly: true,
  permissions: ['BAN_MEMBERS'],
  clientPermissions: ['BAN_MEMBERS'],
  group: 'moderation',
  description: 'Kicks a user and deletes all their messages in the past 14 days',
  examples: ['softban 0123456789012345678'],
  parameters: ['user ID'],
  run: async (client, message, [ mention, ...reason]) => {

    if (!message.mentions.members.size || !mention.match(/\d{17,19}/))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please mention the user to softban. [mention first before adding the reason]`)

    let member = message.mentions.members.get(mention.match(/\d{17,19}/)[0])

    if (member.id === message.author.id)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, You cannot softban yourself!`)

    if (member.id === client.user.id)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please don't softban me!`)

    if (member.id === message.guild.ownerID)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, You cannot softban a server owner!`)

    if (client.config.owners.includes(member.id))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, No, you can't softban my developers through me!`)

    if (message.member.roles.highest.position < member.roles.highest.position)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, You can't softban that user! He/She has a higher role than yours`)

    if (!member.bannable)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, I couldn't softban that user!`)

    reason = reason.length ? reason.join(' ').slice(120) : 'None'

    return message.guild.members.ban(user, { reason:  `MAI_SOFTBANS: ${message.author.tag}: ${reason}` })
            .then(()=> {
                message.guild.members.unban(user, { reason: `MAI_SOFTBANS: ${message.author.tag}: ${reason}`})
                  .then(() => message.channel.send(`Successfully softbanned **${member.user.tag}**!`))
                    .catch(()=> message.channel.send(`<:cancel:712586986216489011> | ${message.author}, was permanently banned! Unable to complete the softban process...`))
            }).catch(()=> message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Unable to softban **${user.tag}**! (${user.id})`))

  }
}
