const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'nonxpchannels',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'core',
  description: 'See which channels do not give xp',
  examples: [],
  parameters: [],
  run: (client, message) => {

    const channels = client.guildsettings.profiles.get(message.guild.id).xp.exceptions

    if (!channels.length)
    return message.channel.send(
        new MessageEmbed().setDescription(
          `All channels in this server are xp-enabled!`
        ).setColor('GREEN')
        .setAuthor('XP-Enabled!','https://cdn.discordapp.com/emojis/758316325025087500.gif?v=1')
      )


    return message.channel.send(
        new MessageEmbed().setDescription(
            '\u2000\u2000⚠️\u2000\u2000|\u2000\u2000'
          + 'XP SYSTEM are disabled on '
          + channels.map(c => client.channels.cache.get(c).toString().toString()).join(', ')
        ).setColor('ORANGE')
      )
  }
}
