const moment = require('moment');
const text = require('../../util/string');
const profile = require('../../models/Profile');

// EXPERIMENTAL //
// This feature is still experimental and needs debugging.

module.exports = {
  name: 'daily',
  aliases: [ ],
  guildOnly: true,
  group: 'social',
  description: 'Retrieve your daily reward <3',
  requiresDatabase: true,
  examples: [
    'daily'
  ],
  run: (client, message) => profile.findById(message.author.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, You don't have a *wallet* yet! To create one, type \`${client.prefix}register\`.`);
    } else {

      const now = Date.now();
      const baseamount = 500;
      const previousStreak = doc.data.economy.streak.current;
      let overflow = false, excess = null, streakreset = false;

      if (doc.data.economy.streak.timestamp !== 0 && doc.data.economy.streak.timestamp - now > 0){
        return message.channel.send(`\\❌ **${message.member.displayName}**, You already got your daily reward!\nYou can get your next daily reward in ${moment.duration(doc.data.economy.streak.timestamp - now, 'milliseconds').format('H [hours,] m [minutes, and] s [seconds]')}`);
      };

      if ((doc.data.economy.streak.timestamp + 86400000) < now){
        doc.data.economy.streak.current = 0;
        streakreset = true;
      };

      if (!streakreset){
        doc.data.economy.streak.current++
      };

      if (doc.data.economy.streak.alltime < doc.data.economy.streak.current){
        doc.data.economy.streak.alltime = doc.data.economy.streak.current;
      };

      doc.data.economy.streak.timestamp = now + 72000000;
      const amount = baseamount + 20 * (doc.data.economy.streak.current < 25 ? doc.data.economy.streak.current : 25);

      if (doc.data.economy.wallet + amount > 50000){
        overflow = true
        excess = doc.data.economy.wallet + amount - 50000;
      };

      doc.data.economy.wallet = overflow ? 50000 : doc.data.economy.wallet + amount;

      // Include the streak state and overflow state in the confirmation message
      return doc.save()
      .then(() => message.channel.send([
        `\\✔️ **${message.member.displayName}**, you got your **${text.commatize(amount)}** daily reward.`,
        overflow ? `\n\\⚠️ **Overflow Warning**: Your wallet just overflowed! You need to transfer some of your credits to your bank!` : '',
        streakreset ? `\n\\⚠️ **Streak Lost**: You haven't got your succeeding daily reward. Your streak is reset (x1).` : `\n**Streak x${doc.data.economy.streak.current}**`
      ].join('')))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  })
};
