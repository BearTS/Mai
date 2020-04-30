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
  .addField('\u200B', `Mai [Github Repository](https://github.com/maisans-maid/Mai#readme) | [Website](https://maisans-maid.github.io/mai.moe)`)

).catch( () => message.react("👎") )

  const command = client.commands.get(query.toLowerCase()) || client.commands.find( c => c.config.aliases.includes(query.toLowerCase()))

  if (!command) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`\u200B\nSorry, I couldn't find **${query}** in the commands list!\n\u200B`)).catch( () => message.react("👎") )

  const { config : { name, guildOnly, ownerOnly, adminOnly, modOnly, permissions, clientPermissions, cooldown, description, aliases, examples, parameters } } = command

  return message.channel.send(new MessageEmbed()
  .setAuthor(prefix+name, message.author.displayAvatarURL( {format: 'png', dynamic: true} ))
  .setColor('GREY')
  .setThumbnail(client.user.displayAvatarURL( {format: 'png', dynamic: true} ))
  .setFooter(`Created by Sakurajimai#6742`)
  .setDescription(description)
  .addField('Aliases', aliases && aliases.length ? aliases.join('\n') : 'None', true)
  .addField('Restriction', `${ownerOnly ? `Only my owner has the permission to use this command!` : adminOnly ? `Only server admins are allowed to use this command!` : modOnly ? `Only server Moderators can use this command!`: `Everyone can use this command!`}\n${guildOnly ? 'This can only be used inside server' : 'This can also be used in bot DMs.'}`,true)
  .addField(`Examples`, examples && examples.length ? `\`${prefix}${examples.join(`\`\n\`${prefix}`)}\`` : `None`, true)
  .addField(`Valid Parameters`, `${parameters && parameters.length ? parameters.join(', '): "None"}\n\nMai [Github Repository](https://github.com/maisans-maid/Mai#readme) | [Website](https://maisans-maid.github.io/mai.moe)`,true)
  .addField(`Cooldown`,cooldown && cooldown.time && cooldown.time !== 0 ? `${cooldown.time} seconds` : `None`,true)
  )
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
