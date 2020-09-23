const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "help"
  , aliases: [
    'hello'
    , 'hi'
    , 'hey'
    , 'moshimoshi'
    , 'konnichiwa'
  ]
  , group: "core"
  , description: "Displays basic information or help for a command!"
  , clientPermissions: [
    'EMBED_LINKS'
    , 'ADD_REACTIONS'
  ]
  , examples: [
    'help anime'
    , 'hey'
  ]
  , parameters: [
    'command name'
  ]
  , run: (client, message, [ query ]) => {

    const { config: { prefix, github, website } } = client

    if (!query) return message.channel.send( new MessageEmbed()

    .setAuthor(
      client.user.username,
      message.author.displayAvatarURL({ format:'png', dynamic:true })
    )


    .setColor('GREY')

    .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))

    .setDescription(`Hi! I'm **${client.user.username}** and I am a bot based\naround anime <Specially Aobuta>\nAll my commands start with the prefix \`${prefix}\`!`)

    .addField('\u200B', `Use \`${prefix}cmd\` to see a list of my commands.\nYou can also use \`${prefix}help [command]\` to get help on a specific command.`)

    .addField('\u200B', `Mai [Github Repository](${github}) | [Website](${website})`)

    ).catch( () => message.react("👎") )

    const command = client.commands.get(query.toLowerCase())

    if (!command) return message.channel.send( new MessageEmbed()
      .setColor('RED')
      .setDescription(`\u200B\nSorry, I couldn't find **${query}** in the commands list!\n\u200B`)
    ).catch(() => message.react("👎") )

    const {
      name, guildOnly, ownerOnly,
      adminOnly, modOnly, permissions,
      image, clientPermissions, cooldown,
      description, aliases, examples, parameters } = command

    return message.channel.send(new MessageEmbed()

    .setAuthor(
      prefix+name,
      message.author.displayAvatarURL( {format: 'png', dynamic: true} )
    )

    .setColor('GREY')

    .setDescription(description)

    .addField('Aliases',
      aliases && aliases.length
      ? '`' + aliases.join('`\n`') + '`'
      : 'None')

    .addField('Restriction', `${
        ownerOnly
        ? `•\u2000Only my owner has the permission to use this command!`
        : adminOnly
          ? `•\u2000Only server admins are allowed to use this command!`
          : modOnly
            ? `•\u2000Only server Moderators can use this command!`
            : permissions
              ? `•\u2000Only Members with \`${permissions.map(p => p.split('_').map( a => a[0] + a.slice(1).toLowerCase()).join(' ')).join('`, `')}\` permissions can use this command.`
              : `•\u2000Everyone can use this command!`
          }\n${
        guildOnly
        ? '•\u2000This can only be used inside server'
        : '•\u2000This can also be used in bot DMs.'
      }`)

    .addField(`Examples`,
        examples && examples.length
        ? `\`${prefix}${examples.join(`\`\n\`${prefix}`)}\``
        : `None`)

    .addField(`Valid Parameters`, `${
        parameters && parameters.length
        ? parameters.join(', ')
        : "None"}`)

    .addField(`Cooldown`,
        cooldown && cooldown.time && cooldown.time !== 0
        ? `${cooldown.time / 1000} seconds`
        : `None`)

    .addField('\u200b',`Mai [Github Repository](${github}) | [Website](${website})`)

    .setImage(image)
    )
  }
}
