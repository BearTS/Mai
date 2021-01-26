const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'xpexcempt',
  aliases: ['excemptxp', 'disablexpon', 'xpdisableon'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Disable collecting xp on mentioned channels',
  requiresDatabase: true,
  parameters: [ 'channel ID/Mention' ],
  examples: [
    'xpexcempt 728374657483920192',
    'disablexpon #spam'
  ],
  run: (client, message) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    const channels = message.mentions.channels.map( c => c.id);

    if (!channels.length){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Please mention the channel(s) you want me to not collect xp from.`);
    };

    let newch = []
    let oldch = []

    for (const channelID of channels) {
      if (doc.xp.exceptions.includes(channelID)){
        oldch.push(channelID);
      } else {
        newch.push(channelID);
      };
    };

    if (!newch.length){
      oldch = oldch.map(c => client.channels.cache.get(c).toString().toString()).join(', ');
      return message.channel.send(`\\❌ **${message.member.displayName}**, The mentioned channels ${oldch} are already in the excempt list.`);
    };

    doc.xp.exceptions.push(...newch);

    return doc.save()
    .then(() => {
      client.guildProfiles.get(message.guild.id).xp.exceptions = doc.xp.exceptions;
      return message.channel.send(
        new MessageEmbed()
        .setColor('GREEN')
        .setFooter(`XP | \©️${new Date().getFullYear()} Mai`)
        .setDescription([
          '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          'XP [Experience Points System] will now be disabled on ',
           newch.map(c => client.channels.cache.get(c).toString()).join(', '),
           oldch.length ? `\n\n⚠️\u2000\u2000|\u2000\u2000${oldch.map(c => client.channels.cache.get(c).toString()).join(', ')} are already on excempted list.`: '',
           '\n\nTo see which channels do not give xp, use the command `nonxpchannels`'
        ].join(''))
      );
    }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
