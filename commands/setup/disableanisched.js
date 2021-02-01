const list = require('../../models/GuildWatchlist');

module.exports = {
  name: 'disableanisched',
  aliases: [ 'anischedoff' ],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Disable the anisched feature for this server',
  requiresDatabase: true,
  examples: [
    'disableanisched',
    'anischedoff'
  ],
  parameters: [],
  run: (client, message) => list.findById(message.guild.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    };

    if (!doc){
      doc = new list({ _id: message.guild.id });
    };

    if (doc.channelID === null){
      return message.channel.send(`\\❌ Anischedule is already disabled on this server! You may enable it again through \`${client.prefix}setanischedch\``)
    };

    doc.channelID = null;
    return doc.save()
    .then(() =>  message.channel.send(`\\✔️ Successfully disabled the Anisched feature! You may enable it again through \`${client.prefix}setanischedch\``))
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
