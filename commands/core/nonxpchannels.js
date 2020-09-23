const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'nonxpchannels',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'See which channels do not give xp',
  examples: [],
  parameters: [],
  run: (client, message) => {

    const channels = client.guildsettings.profiles.get(message.guild.id).xp.exceptions

    if (!channels.length)
    return message.channel.send(
        new MessageEmbed().setDescription(
            '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
          + 'All channels in this server is xp-enabled!'
        ).setColor('GREEN')
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
