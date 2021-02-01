const moment = require('moment');
const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'tip',
  aliases: [ ],
  guildOnly: true,
  group: 'social',
  description: 'Give tip to your friends!',
  requiresDatabase: true,
  parameters: [ 'User Mention/ID'],
  examples: [
    'tip @user',
    'tip 78374756574839348'
  ],
  run: (client, message, [user='']) => profile.findById(message.author.id, async (err, tipper) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`);
    } else if (!tipper){
      tipper = new profile({ _id: member.id });
    };

    const now = Date.now();

    if (tipper.data.tips.timestamp !== 0 && tipper.data.tips.timestamp - now > 0){
      return message.channel.send(`\\❌ **${message.author.tag}**, you already used your tip. You can wait for ${moment.duration(tipper.data.tips.timestamp - now).format('H [hours,] m [minutes, and] s [seconds]')} to tip someone again.`);
    } else if (!user){
      return message.channel.send(`\\✔️ **${message.author.tag}**, you can now tip someone from this server!`);
    };

    const member = await message.guild.members
    .fetch(user.match(/\d{17,19}/)?.[0] || 'let-fetch-fail')
    .catch(() => {});

    if (!member){
      return message.channel.send(`\\❌ **${message.author.tag}**, could not add tip to this user. Reason: User not found!`);
    } else if (member.id === message.author.id){
      return message.channel.send(`\\❌ **${message.author.tag}**, you cannot give a tip to yourself!`);
    } else if (member.user.bot){
      return message.channel.send(`\\❌ **${message.author.tag}**, you cannot tip a bot!`);
    };

    return profile.findById(member.id, async (err, doc) => {
      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`);
      } else if (!doc){
        doc = new profile({ _id: member.id });
      };

      const amount = 350;
      let overflow = false, excess = null, unregistered = false;

      if (doc.data.economy.wallet === null){
        unregistered = true;
      } else if (doc.data.economy.wallet + amount > 50000){
        overflow = true;
        excess = doc.data.economy.wallet + amount - 50000;
        doc.data.economy.wallet = 50000;
      } else {
        doc.data.economy.wallet += amount;
      };

      tipper.data.tips.timestamp = now + 432e5;
      tipper.data.tips.given++;
      doc.data.tips.received++;

      return Promise.all([ doc.save(), tipper.save() ])
      .then(() => message.channel.send([
        `\\✔️ **${message.author.tag}**, tipped **${amount}** to **${member.user.tag}**.`,
        overflow ? `\n\\⚠️ **Overflow Warning**: **${member.user.tag}**'s wallet just overflowed! You need to transfer some of your credits to your bank!` : '',
        unregistered ? `\n\\⚠️ **Unregistered**: **${member.user.tag}** is unregistered, the bonus credits will not be added.` : ''
      ].join('')))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
    });
  })
};
