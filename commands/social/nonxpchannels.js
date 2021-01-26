const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');

module.exports = {
  name: 'nonxpchannels',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'social',
  description: 'See which channels do not give xp',
  requiresDatabase: true,
  examples: [
    'nonxpchannels'
  ],
  run: (client, message) => {

    let totalch = message.guild.channels.cache.filter(c => c.send).size;
    let channels = client.guildProfiles.get(message.guild.id).xp.exceptions;
    channels = channels.map(x => client.channels.cache.get(x).toString());

    if (!channels.length){
      return message.channel.send(`\\✔️ **${message.member.displayName}**, All channels in this server are xp-enabled!`);
    } else if (totalch === channels.length){
      return message.channel.send(`\\❌ **${message.member.displayName}**, All channels in this server are xp-disabled!`);
    } else {
      return message.channel.send(
        new MessageEmbed()
        .setColor('ORANGE')
        .setFooter(`XP | \©️${new Date().getFullYear()} Mai`)
        .setDescription([
            '\\⚠️\u2000\u2000|\u2000\u2000',
            `XP SYSTEM are disabled on ${text.joinArray(channels)}`
        ].join(''))
      )
    };
  }
};
