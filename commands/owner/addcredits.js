const profile = require('../../models/Profile');

module.exports = {
  name: 'addcredits',
  aliases: [ ],
  guildOnly: true,
  ownerOnly: true,
  group: 'owner',
  description: 'Add credits to users! Append negative sign to remove credits from users!',
  requiresDatabase: true,
  examples: [
    'addcredits @user 1000'
  ],
  run: async (client, message, [user, amount]) => {

    amount = Number(amount);

    if (!user){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Please specify the User.`);
    } else if (!amount){
      return message.channel.send(`\\❌ **${message.member.displayName}**, Please specify the Value.`);
    };

    user = await client.users.fetch(user.match(/\d{17,19}/)?.[0]).catch(()=>{});

    if (!user){
      return message.channel.send(`\\❌ **${message.member.displayName}**, 404 User Not Found.`);
    }

    return profile.findById(user.id, (err, doc) => {

      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
      } else if (!doc || doc.data.economy.wallet === null){
        return message.channel.send(`\\❌ **${message.member.displayName}**, **User has no wallet.**`);
      };

      const tba = doc.data.economy.wallet + amount

      doc.data.economy.wallet = tba > 50000 ? 50000 : Math.floor(tba);

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${message.member.displayName}**, successfully added ${amount} to **${user.tag}**!`))
      .catch((err) => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
    })
  }
};
