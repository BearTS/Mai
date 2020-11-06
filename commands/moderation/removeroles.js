module.exports = {
  name: 'removeroles',
  aliases: ['resetrole', 'clearrole', 'purgerole'],
  guildOnly: true,
  permissions: ['MANAGE_ROLES'],
  clientPermissions: ['MANAGE_ROLES'],
  group: 'moderation',
  description: 'Removes all applied roles to a user. (excludes default roles)',
  example: ['resetrole @user'],
  parameters: ['user mention', 'user ID'],
  run: async (client, message, [ member ]) => {

    if (!member || !member.match(/\d{17,19}/))
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please supply the ID or mention the member you want the roles to be reset.`)

    member = await message.guild.members.fetch(member.match(/\d{17,19}/)[0]).catch(()=>null)

    if (!member)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Couldn't find the supplied member on this server`)

    await message.channel.send(`This will remove all of **${member.user.tag}**'s roles. Continue?`)
    collector = message.channel.createMessageCollector( res => message.author.id === res.author.id )

    const continued = await new Promise( resolve => {
      const timeout = setTimeout(()=> collector.stop('TIMEOUT'), 30000)
      collector.on('collect', (message) => {
        if (['y','yes'].includes(message.content.toLowerCase())) resolve(true)
        if (['n','no'].includes(message.content.toLowerCase())) resolve(false)
      })
      collector.on('end', () => resolve(false))
    })

    if (!continued)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, cancelled the removeroles command!`)

    return member.roles.set([])
      .then((member) => message.channel.send(`Successfully removed all of **${member.user.tag}**'s roles!`))
        .catch(() => message.channel.send(`Unable to remove all of **${member.user.tag}**'s roles!`))
  }
}
