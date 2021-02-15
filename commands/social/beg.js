const { Collection } = require('discord.js');
const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'beg',
  aliases: [ 'plead', 'gimme' ],
  group: 'social',
  description: 'Want to earn money some more? Why don\'t you try begging, maybe someone will give you.',
  requiresDatabase: true,
  examples: [
    'beg',
    'plead',
    'gimme'
  ],
  run: (client, message) => profile.findById(message.author.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *wallet* yet! To create one, type \`${client.prefix}register\`.`);
    } else {

      const now = Date.now();
      const duration = Math.floor(Math.random() * 7200000) + 3600000;
      const beg = client.collections.economy.get('beg') || client.collections.economy.set('beg', new Collection()).get('beg');
      const userprofile = beg.get(message.author.id) || beg.set(message.author.id, { date: 0 }).get(message.author.id);
      let overflow = false, excess = null;

      if (userprofile.date > now){
        return message.channel.send(`\\❌ **${message.author.tag}**, You have already been given some *coins* earlier! Please try again later.`);
      };

      userprofile.date = Date.now() + duration;
      const amount = Math.floor(Math.random() * 200) + 100;

      if (doc.data.economy.wallet + amount > 50000){
        overflow = true;
        excess = doc.data.economy.wallet + amount - 50000
      };

      doc.data.economy.wallet = overflow ? 50000 : doc.data.economy.wallet + amount;

      return doc.save()
      .then(() => message.channel.send([
        `\\✔️ **${message.author.tag}**, You received **${amount}** from me.`,
        overflow ? `\n⚠️Overflow warning! Please deposit some of your account to your **bank**. You only received ${amount-excess} for this one!` :'',
        `\nTo Check your balance, type \`${client.prefix}bal\`\n`,
        `Keep your wallet from *overflowing* --> <https://github.com/maisans-maid/Mai/wiki/Economy#Overflow)>`
      ].join('')))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  })
};
