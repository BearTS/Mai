const text = require(`${process.cwd()}/util/string`);
const profile = require(`${process.cwd()}/models/Profile`);

module.exports = {
  name: 'bank',
  aliases: [ 'registerbank' ],
  guildOnly: true,
  group: 'social',
  description: 'Check your wallet, how much have you earned?',
  get examples(){ return [this.name, ...this.aliases];},
  run: (client, message) => profile.findById(message.author.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Bank requires coins to register, but you don't have a *wallet* yet! To create one, type \`${client.prefix}register\`.`);
    } else if (doc.data.economy.bank !== null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, You already have a bank account.\n`);
    } else if (doc.data.economy.wallet < 2500){
      return message.channel.send(`\\❌ **${message.member.displayName}**,  it seems like you don't have enough coins to register in a bank ((***${tex.commatize(2500 - doc.data.economy.wallet)}** more coins are needed*).`)
    } else {
      doc.data.economy.wallet = doc.data.economy.wallet - 2500;
      doc.data.economy.bank = 2500;

      return data.save()
      .then(() => message.channel.send(`✔️ **${message.member.displayName}**, Registered to a bank! The **2,500** fee was transferred to your bank. To check your balance, type \`${client.prefix}bal\``))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  })
};
