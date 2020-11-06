const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'reload',
  ownerOnly: true,
  group: 'owner',
  description: 'Reloads the command',
  examples: [],
  parameters: [],
  run: async (client, message, [commandname]) => {

    if (!commandname) return message.channel.send(`<:cancel:767062250279927818> | Please specify the command to load!`)

    const { status, err, info } = await client.commands.reload(commandname)

    if (status === 'FAILED')

    {

      const stacktrace = `${err.stack.split('\n').splice(0,5).join('\n').split(process.cwd()).join('MAIN_PROCESS')}\n\n...and ${err.stack.split('\n').length - 5} lines more`

      if (message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
        return message.channel.send( new MessageEmbed()
                                      .setColor('RED')
                                      .setAuthor('Failed to load the specified command...','https://cdn.discordapp.com/emojis/767062250279927818')
                                      .setDescription(`\`\`\`xl\n${stacktrace}\n\`\`\``)
                                   )

      return message.channel.send(`<:cancel:767062250279927818> | Failed to reload the specified command: \n\`\`\`xl\n{}\n\`\`\``)

    }

    if (message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS'))
      return message.channel.send( new MessageEmbed()
                                    .setColor('GREEN')
                                    .setAuthor('✔️ Successfully loaded the specified command...')
                                    .setDescription(`\`\`\`xl\n${require('util').inspect(info)}\n\`\`\``)
                                    .setFooter(`You may now use the command with *${client.config.prefix}${info.name}`)
                                 )

    return message.channel.send(`Successfully reloaded the command **${commandname}**`)

  }
}
