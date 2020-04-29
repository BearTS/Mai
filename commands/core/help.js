const { MessageEmbed } = require('discord.js')
const { default: { prefix } } = require('../../settings.json')

module.exports.run = (client, message, [ query ]) => {

  if (!query) return message.channel.send( new MessageEmbed()
  .setAuthor(client.user.username, message.author.displayAvatarURL({ format:'png', dynamic:true }))
  .setColor(!message.member.displayColor ? 'GREEN' : message.member.displayColor)
  .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
  .setFooter(`Created with ❤ by Sakurajimai#6742`)
  .setDescription(`Hi! I'm **${client.user.username}** and I am a bot based\n\around anime <Specially Aobuta>\n\All my commands start with the prefix \`${prefix}\`!`)
  .addField('\u200B', `Use \`${ prefix }cmd\` to see a list of my commands.\nYou can also use \`${ prefix }help [command]\` to get help on a specific command.`)
).catch( () => message.react("👎") )

  const command = client.commands.get(query.toLowerCase()) || client.commands.find( c => c.config.aliases.includes(query.toLowerCase()))

  if (!command) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`Sorry, I couldn't find **${args.join(' ')}** in the commands list!`)).catch( () => message.react("👎") )

  let examples = ''
  command.config.examples.forEach(e =>  examples += `\`${prefix}${e}\`\n`)

  return message.channel.send( new MessageEmbed()
  .setAuthor(prefix+command.config.name, client.user.displayAvatarURL( {format:'png', dynamic: true} ))
  .setColor(!message.member.displayColor ? 'GREEN' : message.member.displayColor)
  .setThumbnail(client.user.displayAvatarURL( {format:'png', dynamic: true} ))
  .setFooter(`Created by Sakurajimai#6742`)
  .setDescription(command.config.description)
  .addField('Aliases', command.config.aliases.length ? command.config.aliases.join(', ') : 'None')
  .addField('Examples', examples !== '' ? examples : 'None')
  .addField('Required Parameters', command.config.parameters ? command.config.parameters.join(', ') : 'None')
).catch( () => message.react("👎") )

}

module.exports.config = {
  name: "help",
  aliases: ['hello','hi','hey','moshimoshi','konnichiwa'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "core",
  description: "Displays basic information or help for a command!",
  examples: ['help anime','hey'],
  parameters: ['command name']
}
