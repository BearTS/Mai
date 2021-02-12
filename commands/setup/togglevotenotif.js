const profile = require('../../models/Profile');

module.exports = {
  name: 'togglevotenotif',
  aliases: [],
  group: 'setup',
  description: 'Toggles your vote notification on/off',
  requiresDatabase: true,
  parameters: [ ],
  examples: [ ],
  run: (client, message) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    };

    if (!doc){
      doc = new profile();
    };

    const status = doc.data.vote.notification;
    doc.data.vote.notification = !status;

    return doc.save()
    .then(() => message.channel.send(`\\✔️ | ${message.author.tag}, successfully ${status ? 'Disabled' : 'Enabled'} the vote notifications. You will now stop receiving DM notifications when voting me on **top.gg**.`))
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
