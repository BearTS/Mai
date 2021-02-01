const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'xpenable',
  aliases: ['enablexp', 'enablexpon', 'xpenableon'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Enable collecting xp on **Disabled** mentioned channels',
  requiresDatabase: true,
  examples: [
    'xpenable'
  ],
  run: (client, message) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    const channels = message.mentions.channels.map( c => c.id);

    if (!channels.length){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Please mention the channel(s) you want me to collect xp from.`);
    };

    let nonavail = []
    let avail = []

    for (const channelID of channels) {
      if (doc.xp.exceptions.includes(channelID)){
        avail.push(channelID);
      } else {
        nonavail.push(channelID);
      };
    };

    if (!avail.length){
      const oldch = channels.map(x => `<#${x}>`).join(', ');
      return message.channel.send(`\\❌ **${message.member.displayName}**, The mentioned channels ${oldch} are not in the excempt list.`);
    };

    for (const channel of avail){
      const index = doc.xp.exceptions.indexOf(channel);
      doc.xp.exceptions.splice(index, 1);
    };

    return doc.save()
    .then(() => {
      client.guildProfiles.get(message.guild.id).xp.exceptions = doc.xp.exceptions;
      return message.channel.send(
        new MessageEmbed()
        .setColor('GREEN')
        .setFooter(`XP | \©️${new Date().getFullYear()} Mai`)
        .setDescription([
          '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          'XP [Experience Points System] have been reenabled on ',
           avail.map(c => client.channels.cache.get(c).toString()).join(', '),
           nonavail.length ? `\n\n⚠️\u2000\u2000|\u2000\u2000${nonavail.map(c => client.channels.cache.get(c).toString()).join(', ')} are not on excempted list.`: '',
           '\n\nTo see which channels do not give xp, use the command `nonxpchannels`'
        ].join(''))
      );
    }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
