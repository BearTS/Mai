const profile = require('../../models/Profile');
const market = require('../../assets/json/market.json');

module.exports = {
  name: 'deleteitem',
  aliases: [ ],
  rankcommand: true,
  group: 'social',
  description: 'Deletes an item you own.',
  requiresDatabase: true,
  parameters: [ 'item ID', 'amount' ],
  examples: [
    'deleteitem 10',
    'deleteitem 18 2'
  ],
  run: (client, message, [id, amount]) => profile.findById(message.author.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new profile({ _id: message.author.id });
    };

    const item = market.find(x => x.id == id);

    if (!item){
      return message.channel.send(`\\❌ **${message.author.tag}**, Could not find the item with id ${id}!`);
    } else if (!item.deletable){
      return message.channel.send(`\\❌ **${message.author.tag}**, item **${item.name}** is not deletable!`);
    };

    const itemcount = doc.data.profile.inventory.find(x => x.id === item.id)?.amount;
    amount = Math.round(amount || 1);

    if (!amount){
       return message.channel.send(`\\❌ **${message.author.tag}**, Invalid amount of item to be deleted!`);
    } else if (!itemcount || itemcount < amount){
      return message.channel.send(`\\❌ **${message.author.tag}**, You do not have the necessary amount of **${item.name}** to delete.`);
    };

    const old = doc.data.profile.inventory
    .find(x => x.id === item.id);
    let data = doc.data.profile.inventory
    .splice(doc.data.profile.inventory
      .findIndex(x => x.id === old.id), 1)[0];
    data.amount -= amount;

    if (data.amount > 0){
      doc.data.profile.inventory.push(data);
    } else if (item.assets.link === doc.data.profile[item.type]){
      doc.data.profile[item.type] = null;
    } else {
      // Do nothing...
    };

    return message.channel.send(`This will delete **${amount}x** of your **${item.name}**, continue? [y/n]`)
    .then(async () => {
       const filter = _message => message.author.id === _message.author.id && ['y','n','yes','no'].includes(_message.content.toLowerCase());
       const options = { max: 1, time: 30000, errors: ['time'] };
       const proceed = await message.channel.awaitMessages(filter, options)
       .then(collected => ['y','yes'].includes(collected.first().content.toLowerCase()) ? true : false)
       .catch(() => false);

      if (!proceed){
         return message.channel.send(`\\❌ Cancelled operation!`);
      };

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, Successfully deleted **${amount}x** of your **${item.name}!!**`))
      .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    });
  })
};
