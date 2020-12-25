const profile = require(`${process.cwd()}/models/Profile`);
const market = require(`${process.cwd()}/assets/json/market.json`);
const text = require(`${process.cwd()}/util/string`);

module.exports = {
  name: 'buy',
  aliases: [],
  rankcommand: true,
  clientPermissions: [ 'MANAGE_MESSAGES' ],
  group: 'social',
  description: 'Check what you can buy from the shop.',
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
    const total = item.price * amt;

    if (!item.price && amt > 1){
      return message.channel.send(`\\❌ **${message.author.tag}**, You may only have 1 free item at a time.`);
    } else if (doc.data.economy.wallet < total){
      return message.channel.send(`\\❌ **${message.author.tag}**, You do not have enough credits to proceed with this transaction! You need ${text.commatize(total)} for **${amt}x ${item.name}**`);
    } else if (doc.data.profile.inventory.find(x => x.id === item.id) && !item.price){
      return message.channel.send(`\\❌ **${message.author.tag}**, You may only have 1 free item at a time.`);
    } else {

      const old = doc.data.profile.inventory.find(x => x.id === item.id);
      if (old){
        const inv = doc.data.profile.inventory;
        let data = doc.data.profile.inventory.splice(inv.findIndex(x => x.id === old.id),1)[0];
        data.amount = data.amount + amt;
        doc.data.profile.inventory.push(data)
      } else {
        doc.data.profile.inventory.push({
          id: item.id,
          amount: amt
        });
      };

      doc.data.economy.wallet = doc.data.economy.wallet - total;
      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, successfully purchased **${amt}x ${item.name}!**`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    };
  })
};
