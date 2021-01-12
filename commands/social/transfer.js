const profile = require(`${process.cwd()}/models/Profile`);
const text = require(`${process.cwd()}/util/string`);

module.exports = {
  name: 'transfer',
  aliases: [ 'give' ],
  guildOnly: true,
  group: 'social',
  description: 'Transfer some of your credits to your friends!',
  requiresDatabase: true,
  parameters: [ 'User Mention', 'Amount' ],
  get examples(){ return [this.name, ...this.aliases];},
  run: (client, message, [ friend='', amount='' ]) => profile.findById(message.author.id, async (err, doc) => {

    const fr = friend;
    friend = await message.guild.members.fetch(friend.match(/\d{17,19}/)||[][0]||' ')
    .catch(()=>{});

    amount = Math.round(amount.split(',').join(''));

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, You don't have a **wallet** yet!\nTo create one, type \`${client.prefix}register\`.`);
    } else if (doc.data.economy.bank === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, You don't have a **bank** yet!\nTo create one, type \`${client.prefix}bank\`.`);
    } else if (!friend){
      return message.channel.send(`\\❌ **${message.member.displayName}**, I couldn't find ${fr} in this server!`);
    } else if (!amount){
      return message.channel.send(`\\❌ **${message.member.displayName}**, **${amount}** is not a valid amount!`);
    } else if (amount < 100 || amount > 20000){
      return message.channel.send(`\\❌ **${message.member.displayName}**, only valid amount to transfer is between **100** and **20,000**!`);
    } else if (Math.ceil(amount * 1.1) > doc.data.economy.bank){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Insuffecient credits! You only have **${text.commatize(doc.data.economy.bank)}** in your bank! (10% fee applies)`);
    };

    const friendName = friend.displayName;
    friend = await profile.findById(friend.id).catch(()=>{});

    if (!(friend instanceof profile)){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    };

    if (!friend || friend.economy.data.bank === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, **${friend.displayName}** doesn't have a bank yet! He is not yet eligible to receive credits!`);
    };

    doc.data.economy.bank = doc.data.economy.bank - Math.floor(amount * 1.1);
    friend.data.economy.bank = friend.data.economy.bank + amount;

    return Promise.all([ doc.save(), friend.save() ])
    .then(()=> message.channel.send(`\\✔️ **${message.member.displayName}**, successfully transferred **${amount}**`))
    .catch(()=> message.channel.send(`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`));
  })
};
