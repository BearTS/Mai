const profile = require(`${process.cwd()}/models/Profile`);
const market = require(`${process.cwd()}/assets/json/market.json`);

module.exports = {
  name: 'deleteitem',
  aliases: [ ],
  rankcommand: true,
  group: 'social',
  description: 'Deletes the item you own.',
  run: (client, message, [id, amount]) => profile.findById(message.author.id, (err,doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new profile({ _id: message.author.id });
    };

    const item = market.find(x => x.id == id);

    if (!item){
      return message.channel.send(`\\❌ **${message.author.tag}**, Could not find the item with id ${id}!`);
    };

    const itemcount = doc.data.profile.inventory.find(x => x.id === item.id)?.amount;

    if (!itemcount || itemcount < amt){
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
    } else {
      // Do nothing...
    };

    return message.channel.send(`This will delete **${amount}x** of your **${item.name}**, continue? [y/n]`, { max: 1 })
    .then(() => message.channel.awaitMessages(x => x.author.id === message.author.id)
      .then((msg) => {
        if (msg.content.match(/n/i)?.[0]){
          return Promise.reject();
        } else {
          return doc.save()
          .then(() => message.channel.send(`\\✔️ **${message.author.tag}**, Successfully deleted **${amount}x** of your **${item.name}!!**`))
          .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        }
      }).catch(() => message.channel.send(`\\❌ Cancelled operation!`))
    );
  })
};
