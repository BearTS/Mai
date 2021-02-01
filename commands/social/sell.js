const text = require('../../util/string');
const profile = require('../../models/Profile');
const market = require('../../assets/json/market.json');

module.exports = {
  name: 'sell',
  aliases: [],
  rankcommand: true,
  clientPermissions: [ 'MANAGE_MESSAGES' ],
  group: 'social',
  description: 'Sell some of your items to the shop.',
  parameters: [ 'item ID', 'amount' ],
  examples: [
    'sell 7 2',
    'sell 18'
  ],
  run: (client, message, [id, amt] ) => profile.findById(message.author.id, async (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new profile({ _id: message.author.id });
    };

    const item = market.find(x => x.id == id);

    if (!item){
      return message.channel.send(`\\❌ **${message.author.tag}**, Could not find the item with id ${id}!`);
    };

    amt = Math.floor(Math.abs(amt)) || 1;
    const total = item.price * 0.7 * amt;
    const itemcount = doc.data.profile.inventory.find(x => x.id === item.id)?.amount;

    if (!itemcount || itemcount < amt){
      return message.channel.send(`\\❌ **${message.author.tag}**, You do not have the necessary amount of **${item.name}** to sell.`);
    } else if (!item.price){
      return message.channel.send(`\\❌ **${message.author.tag}**, Unable to sell ${item.name}.`);
    } else if (doc.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, You cannot sell items yet without a bank. Create one before selling items.`)
    } else {

      const inv = doc.data.profile.inventory;
      const old = inv.find(x => x.id === item.id);
      let data = doc.data.profile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
      data.amount = data.amount - amt;

      if (data.amount > 0){
        doc.data.profile.inventory.push(data);
      } else if (item.assets.link === doc.data.profile[item.type]) {
        doc.data.profile[item.type] = null;
      } else {
        // Do nothing...
      };

      doc.data.economy.bank = doc.data.economy.bank + total;
      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, successfully sold **${amt}x ${item.name}** for **${text.commatize(total)}**`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  })
};
