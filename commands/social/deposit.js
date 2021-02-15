const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'deposit',
  aliases: [ 'dep' ],
  group: 'social',
  description: 'Deposit your credits to safeguard it!',
  parameters: [ 'Amount' ],
  requiresDatabase: true,
  examples: [
    'deposit 10000',
    'dep all'
  ],
  run: (client, message, [amount]) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *wallet* yet! To create one, type \`${client.prefix}register\`.`);
    } else if (doc.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *bank* yet! To create one, type \`${client.prefix}bank\`.`);
    } else {

      const amt = amount;

      if (amount?.toLowerCase() === 'all'){
        amount = Math.floor(doc.data.economy.wallet * 0.95);
      } else {
        amount = Math.round(amount?.split(',').join(''));
      };

      if (!amount){
        return message.channel.send(`\\❌ **${message.author.tag}**, [ **${amt || 0}** ] is not a valid amount!.`);
      } else if (amount < 100){
        return message.channel.send(`\\❌ **${message.author.tag}**, The amount to be deposited must be at least **100**.`);
      } else if (amount * 1.05 > doc.data.economy.wallet){
        return message.channel.send([
          `\\❌ **${message.author.tag}**, You don't have enough credits in your wallet to proceed with this transaction.`,
          ` You only have **${text.commatize(doc.data.economy.wallet)}** left, **${text.commatize(amount - doc.data.economy.wallet + Math.ceil(amount * 0.05))}** less than the amount you want to deposit (Transaction fee of 5% included)`,
          `To deposit all credits instead, please type \`${client.prefix}deposit all\`.`
        ].join('\n'));
      };

      doc.data.economy.bank = doc.data.economy.bank + amount;
      doc.data.economy.wallet = doc.data.economy.wallet - Math.floor(amount * 1.05);

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, you successfully deposited **${text.commatize(amount)}** credits to your bank! (+5% fee).`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  })
};
