const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'withdraw',
  aliases: [ ],
  group: 'social',
  description: 'Withdraw some of your money from the bank.',
  requiresDatabase: true,
  parameters: [ 'Amount' ],
  examples: [
    'withdraw 17000',
    'withdraw all'
  ],
  run: (client, message, [amount='']) => profile.findById(message.author.id, (err,doc) =>{

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *wallet* yet! To create one, type \`${client.prefix}register\`.`);
    } else if (doc.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *bank* yet! To create one, type \`${client.prefix}bank\`.`);
    } else {

      const amt = amount;
      if (amount.toLowerCase() === 'all'){
        amount = Math.round(doc.data.economy.bank);
      } else {
        amount = Math.round(amount.split(',').join('')) / 0.95;
      };

      if (!amount){
        return message.channel.send(`\\❌ **${message.author.tag}**, [ **${amt}** ] is not a valid amount!.`);
      } else if (amount < 100){
        return message.channel.send(`\\❌ **${message.author.tag}**, The amount to be withdrawn must be at least **100**.`);
      } else if (amount > doc.data.economy.bank){
        return message.channel.send([
          `\\❌ **${message.author.tag}**, You don't have enough credits in your bank to proceed with this transaction.`,
          ` You only have **${text.commatize(doc.data.economy.bank)}** left, **${text.commatize(amount - doc.data.economy.bank + Math.ceil(amount * 0.05))}** less than the amount you want to withdraw (Transaction fee of 5% included)`,
          `To withdraw all credits instead, please type \`${client.prefix}withdraw all\`.`
        ].join('\n'));
      } else if (amount + doc.data.economy.wallet > 50000){
        return message.channel.send(`\\❌ **${message.author.tag}**, You can't withdraw this large sum of money (Overflow imminent)!`)
      };

      doc.data.economy.bank = Math.round(doc.data.economy.bank - amount);
      doc.data.economy.wallet = doc.data.economy.wallet + Math.round(amount * 0.95);

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, you successfully withdrawn **${text.commatize(amount * 0.95)}** credits from your bank! (+5% fee).`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    }
  })
};
