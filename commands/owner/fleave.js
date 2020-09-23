const { MessageEmbed, TextChannel } = require('discord.js')

module.exports = {
  name: 'fleave',
  aliases: ['forceleave','leaveguild','removeguild','leaveserver'],
  ownerOnly: true,
  group: 'owner',
  description: 'Leaves a guild!',
  examples: [`fleave 652351928364738294`],
  parameters: ['server ID'],
  run: async ( client, message, [id, ...reason] ) => {

    if (!id) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please specify the server id you want me to leave from.`)

    const guild = client.guilds.cache.get(id)

    if (!guild) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, I was not able to find a guild with id **${id}**`)

    reason = reason.length ? reason.join(' ') : 'Im sorry but the reason was unspecified by my developer!'

    let channel = guild.channels.cache.filter( c => c instanceof TextChannel && c.permissionsFor(guild.me).has('SEND_MESSAGES')).first() || guild.owner

    await channel.send(new MessageEmbed().setColor('RED').setTitle(`👋 My developer has requested that I leave ${guild.name}!`).addField(`Reason`,reason)).catch(console.error)

    return guild.leave().then( g => {
      message.channel.send(`Successully left the guild **${guild.name}**!!`)
    }).catch(console.error)
  }
}
