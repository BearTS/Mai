const { MessageEmbed } = require('discord.js')

module.exports.run = async (client, message, args) => {

if (!args.length) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`Specify the guild ID to leave.`))

const guild = client.guilds.cache.get(args[0])

if (!guild) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`could not get guild with id **${args[0]}**`))

let reason = args.slice(1).join(' ')

if (!reason.length) reason = 'Im sorry but the reason was unspecified by the developer!'

let channel = guild.channels.cache.filter(c => c.type = 'text').filter(c => c.parent !== null).find( c => c.permissionsFor(guild.me).has('SEND_MESSAGES'))

  try {

    try {

      await channel.send(new MessageEmbed().setColor('RED').setTitle(`👋 My developer has requested that I leave ${guild.name}!`).addField(`Reason`,reason))

    } catch (err) {

      await guild.owner.send(new MessageEmbed().setColor('RED').setTitle(`👋 My developer has requested that I leave ${guild.name}!`).addField(`Reason`,reason))

    }

      guild.leave()
      message.channel.send(`Successfully left the guild **${guild.name}**!!`)

  } catch (err) {

    return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`There was an error trying to leave **${guild.name}**`))

  }

}

module.exports.config = {
  name: "fleave",
  aliases: ['forceleave','leaveguild','removeguild'],
  group: 'owner',
  description: 'Leaves a guild!',
  examples: [`fleave 652351928364738294`],
  parameters: ['server ID'],
  ownerOnly: true
}
