const profile = require(`${process.cwd()}/models/Profile`);

module.exports = {
  name: 'register',
  aliases: [ ],
  guildOnly: true,
  group: 'social',
  description: 'Start earning credits. Register to keep track of your earned credits!',
  get examples(){ return [this.name, ...this.aliases];},
  run: (client, message) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (doc){
      return message.channel.send(`\\❌ **${message.member.displayName}**, You already had a **wallet**!\nTo check your balance, type \`${client.prefix}bal\``);
    };

    const wallet = Math.floor(Math.random() * 250) + 250;

    return new profile({
      _id: message.author.id,
      data: { economy: { wallet }}
    }).then(() => message.channel.send(`\\✔️ **${message.member.displayName}**, you were successfully registered! You received **${wallet}** as a gift!\nTo check your balance, type \`${client.prefix}bal\``))
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
