const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'kick',
  aliases: [],
  guildOnly: true,
  permissions: ['KICK_MEMBERS'],
  clientPermissions: ['KICK_MEMBERS'],
  group: 'moderation',
  description: 'kick mentioned user from this server.',
  examples: ['kick @user'],
  parameters: ['user mention'],
  run: async ( client, message, [ mention, ...reason ]) => {

    if (!message.mentions.members.size || !mention.match(/\d{17,19}/))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please mention the user to kick. [mention first before adding the reason]`)

    let member = message.mentions.members.get(mention.match(/\d{17,19}/)[0])

    if (member.id === message.author.id)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, You cannot kick yourself!`)

    if (member.id === client.user.id)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please don't kick me!`)

    if (member.id === message.guild.ownerID)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, You cannot kick a server owner!`)

    if (client.config.owners.includes(member.id))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, No, you can't kick my developers through me!`)

    if (message.member.roles.highest.position < member.roles.highest.position)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, You can't kick that user! He/She has a higher role than yours`)

    if (!member.kickable)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, I couldn't kick that user!`)

    reason = reason.length ? reason.join(' ') : 'None'

    await message.channel.send(`Are you sure you want to kick **${member.user.tag}**? (y/n)`)
    let collector = message.channel.createMessageCollector( res => message.author.id === res.author.id )

    const proceed_kick = await new Promise( resolve => {
      const timeout = setTimeout(()=> collector.stop('TIMEOUT'), 30000)
      collector.on('collect', (message) => {
        if (['y','yes','ok','sure'].includes(message.content.toLowerCase())) resolve(true)
        if (['n','no','nah','nvm'].includes(message.content.toLowerCase())) resolve(false)
      })
      collector.on('end', () => resolve(false))
    })

    if (!proceed_kick) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, cancelled the ban command!`)

    await message.channel.send(`Inform **${member.user.tag}** about the kick? (y/n)`)
    collector = message.channel.createMessageCollector( res => message.author.id === res.author.id )

    const dmuser = await new Promise( resolve => {
      const timeout = setTimeout(()=> collector.stop('TIMEOUT'), 30000)
      collector.on('collect', (message) => {
        if (['y','yes'].includes(message.content.toLowerCase())) resolve(true)
        if (['n','no'].includes(message.content.toLowerCase())) resolve(false)
      })
      collector.on('end', () => resolve(false))
    })

    const DMed = dmuser && await member.send(new MessageEmbed().setAuthor('Ban Notice!').setDescription(`Oh no ${member}! You have been kicked from **${message.guild.name}**!\n\n${message.author.tag} has kicked you from our server${reason === 'None' ? '.' : ` because of the following reason:\n\`\`\`${reason}\n\`\`\``}`).setColor('RED').setThumbnail(message.author.displayAvatarURL()).setFooter('This message is auto-generated.').setTimestamp()).catch(()=>null) ? true : false

    return member.kick({ reason: `MAI_KICKS: ${message.author.tag}: ${reason}`})
              .then(()=> message.channel.send(`Successfully kicked **${member.user.tag}**${dmuser ? DMed ? ` and sent the notification!` : `but failed to notify about the kick. They probably had their DMs closed.` :'.'}`))
                .catch(()=> message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Failed to kick **${member.user.tag}**`))

  }
}
