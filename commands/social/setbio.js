const profile = require('../../models/Profile');

module.exports = {
  name: 'setbio',
  aliases: [],
  rankcommand: true,
  clientPermissions: [],
  group: 'social',
  description: 'Sets the profile bio for your profile card.',
  requiresDatabase: true,
  paramters: [ 'bio' ],
  examples: [
    'setbio The coolest person in town'
  ],
  run: async (client, message, args ) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new profile({ _id: message.author.id });
    };

    if (!args.length){
      return message.channel.send(`\\❌ **${message.author.tag}**, Please add the text for your bio (max 200 char.)`);
    } else if (args.join(' ').length > 200){
      return message.channel.send(`\\❌ **${message.author.tag}**, Bio text should not exceed 200 char.`);
    } else {
      doc.data.profile.bio = args.join(' ');

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, your bio has been updated!`))
      .catch(() => message.channel.send(`\\❌ **${message.author.tag}**, your bio update failed!`))
    };
  })
}
