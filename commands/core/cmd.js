const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "cmd"
  , aliases: [
    'command'
    , 'commands'
  ]
  , group: "core"
  , description: "Sends a list of all commands from a specific command group"
  , clientPermissions: [
    'EMBED_LINKS'
    , 'ADD_REACTIONS'
  ]
  , examples: [
    'cmd anime'
    , 'commands'
  ]
  , parameters: [
    'command group'
  ]
  , run: (client, message, [ query ]) => {

    if (query && client.config.commanddir.includes(query.toLowerCase())){

      const fields = []

      client.commands.groups.get(query.toLowerCase()).map( command => {
        fields.push({
          name: command.name,
          value: command.description + '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          inline: false
        })
      })

      return message.channel.send(
        new MessageEmbed()
        .setAuthor(`${query[0].toUpperCase() + query.slice(1).toLowerCase()} commands!`)
        .addFields(fields)
        .setFooter('Made by: Sakurajimai#6742')
        .setColor('GREY')
      )
    }

    if (query) return message.reply(`I couldn't find the command group **${query}** on my list. Here are the valid command groups that i have:\n\n${client.config.commanddir.join(', ')}`)
  }
}
