const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'transfer',
  aliases: [ 'give' ],
  guildOnly: true,
  group: 'social',
  description: 'Transfer some of your credits to your friends!',
  requiresDatabase: true,
  parameters: [ 'User ID/Mention', 'Amount' ],
  examples: [
    'transfer @user 5000',
    'transfer 76859403847563546 10000'
  ],
  run: (client, message, [ friend='', amount='' ]) => profile.findById(message.author.id, async (err, doc) => {

    const fr = friend;
    friend = await message.guild.members.fetch(friend.match(/\d{17,19}/)?.[0]||' ')
    .catch(()=>{});

    amount = Math.round(amount.split(',').join('')) || 'Nothing';

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a **wallet** yet!\nTo create one, type \`${client.prefix}register\`.`);
    } else if (doc.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a **bank** yet!\nTo create one, type \`${client.prefix}bank\`.`);
    } else if (!fr){
      return message.channel.send(`\\❌ **${message.author.tag}**, please specify the user you want to give credits to!`);
    } else if (!friend){
      return message.channel.send(`\\❌ **${message.author.tag}**, I couldn't find \`${fr}\` in this server!`);
    } else if (!amount || amount === 'Nothing'){
      return message.channel.send(`\\❌ **${message.author.tag}**, **${amount}** is not a valid amount!`);
    } else if (amount < 100 || amount > 20000){
      return message.channel.send(`\\❌ **${message.author.tag}**, only valid amount to transfer is between **100** and **20,000**!`);
    } else if (Math.ceil(amount * 1.1) > doc.data.economy.bank){
      return message.channel.send(`\\❌ **${message.author.tag}**, Insuffecient credits! You only have **${text.commatize(doc.data.economy.bank)}** in your bank! (10% fee applies)`);
    };

    const friendName = friend.user.tag;
    friend = await profile.findById(friend.id).catch(err => err);

    if (!friend || friend.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, **${friendName}** doesn't have a bank yet! He is not yet eligible to receive credits!`);
    };

    doc.data.economy.bank = doc.data.economy.bank - Math.floor(amount * 1.1);
    friend.data.economy.bank = friend.data.economy.bank + amount;

    return Promise.all([ doc.save(), friend.save() ])
    .then(()=> message.channel.send(`\\✔️ **${message.author.tag}**, successfully transferred **${amount}** to **${friendName}**`))
    .catch(err => message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: \`${err.name}\``));
  })
};
