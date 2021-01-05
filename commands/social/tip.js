const moment = require('moment');
const text = require(`${process.cwd()}/util/string`);
const profile = require(`${process.cwd()}/models/Profile`);

// EXPERIMENTAL //
// This feature is still experimental and needs debugging.

module.exports = {
  name: 'tip',
  aliases: [ ],
  guildOnly: true,
  group: 'social',
  description: 'Give tip to your friends!',
  requiresDatabase: true,
  get examples(){ return [this.name, ...this.aliases];},
  run: async (client, message, [user = '']) => {

    const member = await message.guild.members
    .fetch(user.match(/\d{17,19}/)?.[0] || 'Let-Fetch-Fail')
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
      } else {
        if (!doc){
          doc = new profile({ _id: member.id });
        };

        const tipper = await profile.findById(message.author.id).catch(() => {}) || new profile({ _id: message.author.id});

        const now = Date.now();
        const amount = 350;
        let overflow = false, excess = null;

        if (tipper.data.tips.timestamp !== 0 && tipper.data.tips.timestamp - now > 0){
          return message.channel.send(`\\❌ **${message.author.tag}**, you already used your tip. You can wait for ${moment.duration(doc.data.tips.timestamp - now).format('H [hours,] m [minutes, and] s [seconds]')} to tip someone again.`);
        };

        if (doc.data.economy.wallet + amount > 50000){
          overflow = true;
          excess = doc.data.economy.wallet + amount - 50000;
        };

        tipper.data.tips.timestamp = now + 432e5;

        tipper.data.tips.given++;
        doc.data.tips.received++;
        doc.data.economy.wallet = overflow ? 50000 : doc.data.economy.wallet + amount;

        return Promise.all([ doc.save(), tipper.save() ])
        .then(() => message.channel.send([
          `\\✔️ **${message.author.tag}**, tipped **${amount}** to **${member.user.tag}**.`,
          overflow ? `\n\\⚠️ **Overflow Warning**: **${member.user.tag}**'s wallet just overflowed! You need to transfer some of your credits to your bank!` : '',
        ].join('')))
        .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
      }
    });
  }
};
