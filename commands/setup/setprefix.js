const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'setprefix',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up custom prefix for this server.',
  requiresDatabase: true,
  parameters: [ 'prefix' ],
  examples: [
    'setprefix ?'
  ],
  run: (client, message, [prefix]) => guilds.findById(message.guild.id, (err, doc) => {

    if (!prefix){
      return message.channel.send(`\\❌ **${message.author.tag}**, No new prefix detected! Please type the new prefix.`);
    } else if (prefix.length > 5){
      return message.channel.send(`\\❌ **${message.author.tag}**, Invalid prefix. Prefixes cannot be longer than 5 characters!`);
    } else {

      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
      } else if (!doc){
        doc = new guilds({ _id: message.guild.id });
      };

      doc.prefix = [prefix, null][Number(!!prefix.match(/clear|reset/i))];

      return doc.save()
      .then(() => {
        client.guildProfiles.get(message.guild.id).prefix = doc.prefix;
        return message.channel.send([
          `\\✔️ **${message.author.tag}**, Successfully`,
          [
            'removed this server\'s prefix!\nTo add prefix, simply pass the desired prefix as parameter.',
            `set this server's prefix to \` ${doc.prefix} \`!\nTo remove the prefix, just pass in \`reset\` or \`clear\` as parameter.`
          ][Number(!!doc.prefix)]
        ].join(' '));
      }).catch(()=> message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  })
};
