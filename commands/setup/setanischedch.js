const list = require('../../models/GuildWatchlist');

module.exports = {
  name: 'setanischedch',
  aliases: [ 'setanischedulechannel', 'setanischedulech', 'setanischedchannel' ],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Where will i post the announcement for recently aired anime?',
  requiresDatabase: true,
  parameters: ['Channel ID/Mention'],
  examples: [
    'setanischedch #anime-updates',
    'setanischedulech 728394059683726123'
  ],
  run: (client, message, [channel='']) => list.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new list({ _id: message.guild.id });
    };

    const channelID = channel.match(/\d{17,19}/)?.[0];
    channel = message.guild.channels.cache.get(channelID);

    if (!channel || !['text', 'news'].includes(channel.type)){
      return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID or channel mention.`);
    } else if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to **Send Messages** on ${channel} and try again.`);
    } else if (!channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to **Embed Links** on ${channel} and try again.`);
    };

    doc.channelID = channel.id;
    return doc.save()
    .then(() => {

      return message.channel.send(`\\✔️ Successfully set the anime airing notification channel to ${channel}!`)
    }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
  })
};
