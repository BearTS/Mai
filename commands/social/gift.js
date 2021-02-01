const profile = require('../../models/Profile');
const market = require('../../assets/json/market.json');

module.exports = {
  name: 'gift',
  aliases: [ 'transferitem', 'itemtransfer' ],
  rankcommand: true,
  group: 'social',
  description: 'Give some of the items you own to a friend.',
  requiresDatabase: true,
  parameters: [ 'user ID/mention' ,'item ID', 'amount' ],
  examples: [
    'gift @user 10 2',
    'transferitem 756475746465746576 21',
    'itemtransfer @user 12'
  ],
  run: (client, message, [friend='', id, amount] ) => profile.findById(message.author.id, async (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      return message.channel.send(`\\❌ **${message.author.tag}**, you have no item in your inventory!`);
    };

    friend = await message.guild.members
    .fetch(friend.match(/\d{17,19}/)?.[0]||' ')
    .catch(() => {});

    if (!friend){
      return message.channel.send(`\\❌ **${message.author.tag}**, That friend could not be found!`);
    };

    const item = market.find(x => x.id == id);
    const itemcount = doc.data.profile.inventory.find(x => x.id === item?.id)?.amount;

    if (!item){
      return message.channel.send(`\\❌ **${message.author.tag}**, Could not find the item with id ${id}!`);
    } else if (!item.giftable){
      return message.channel.send(`\\❌ **${message.author.tag}**, item **${item.name}** is not giftable!`);
    };


    return profile.findById(friend.id, (err, fr) => {

      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
      } else if (!fr){
        return message.channel.send(`\\❌ **${message.author.tag}**, **${friend.user.tag}** have no item in their inventory!`);
      };

      amount = Math.round(amount || 1);

      if (!amount){
        return message.channel.send(`\\❌ **${message.author.tag}**, Invalid amount of item to be transferred!`)
      } else if (!itemcount || amount > itemcount){
        return message.channel.send(`\\❌ **${message.author.tag}**, You don't have the necessary amount of **${item.name}** to complete this transaction!`);
      };

      const old = doc.data.profile.inventory
      .find(x => x.id === item.id);
      let data = doc.data.profile.inventory
      .splice(doc.data.profile.inventory
        .findIndex(x => x.id === old.id), 1)[0];

      data.amount -= amount;

      if (data.amount > 0){
        doc.data.profile.inventory.push(data)
      } else if (item.assets.link === doc.data.profile[item.type]){
        doc.data.profile[item.type] = null;
      } else {
        // Do nothing...
      };

      if (fr.data.profile.inventory.some(x => x.id === item.id)){
        fr.data.profile.inventory.find(x => x.id === item.id).amount += amount;
      } else {
        fr.data.profile.inventory.push({ id: data.id, amount });
      };

      return Promise.all([ doc.save(), fr.save() ])
      .then(()=> message.channel.send(`\\✔️ **${message.member.displayName}**, successfully transferred **${amount}x ${item.name}** to **${friend.user.tag}**`))
      .catch(()=> message.channel.send(`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`))
    });
  })
};
