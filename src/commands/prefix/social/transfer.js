module.exports = {
  name             : 'transfer',
  description      : 'Transfer some of your coins to your friends!',
  aliases          : [ 'give' ],
  cooldown         : { time: 3e4 },
  clientPermissions: [],
  permissions      : [],
  guildOnly        : true,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'User ID/Mention', 'Amount' ],
  examples         : [ 'transfer @user 5000', 'transfer 76859403847563546 10000' ],
  run              : async (message, language, [member, amount]) => {

    const profileDB  = message.client.database.Profile;
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const sender     = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id.id });
    // When the database returns an error instead of a document
    if (sender instanceof Error){
      message.author.cooldown.delete('transfer');
      parameters.assign({ '%ERROR%': sender.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };
    // When the sender didn't include any argument
    if (!member){
      message.author.cooldown.delete('transfer');
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_NOMEM', parameters }));
    };
    // When the argument provided by the sender does not match an id
    if (!member.match(/\d{17,18}/)?.[0]){
      message.author.cooldown.delete('transfer');
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_INMEM', parameters }));
    };
    member = await message.guild.members.fetch(member.match(/\d{17,18}/)[0]).catch(() => {});
    // When the argument is not a valid discord user id or the user is not in this server
    if (!member){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_INMEM', parameters }));
    };
    // When the argument ID resolves to a bot
    if (member.user.bot){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_BTMEM', parameters }));
    };
    // When the argument ID resolves to the user himself
    if (member.id === message.author.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_TSELF', parameters }));
    };
    // When the receiver is less than 2 weeks old
    if (Date.now() - member.user.createdAt < 12096e5){
      message.author.cooldown.delete('transfer');
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_YOUNG', parameters }));
    };
    // No amount was provided
    if (!amount){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_NOAMT', parameters }));
    };
    // The amount is not a Number
    if (isNaN(amount) || amount < 100){
      message.author.cooldown.delete('transfer');
      parameters.assign({ '%AMOUNT%': amount });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_INAMT', parameters }));
    };
    // The amount to give is larger than the sender's current bank
    if (Math.ceil(amount * 1.1) > sender.data.economy.bank){
      parameters.assign({ '%BANK%': message.client.services.UTIL.NUMBER.separate(sender.data.economy.bank) });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_INSUF', parameters }));
    };
    const receiver = member.user.profile || await profileDB.findById(member.id).catch(err => err) || new profileDB({ _id: member.id });
    // When the database returns an error instead of a document
    if (receiver instanceof Error){
      parameters.assign({ '%ERROR%': receiver.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };
    sender.data.economy.bank -= Math.ceil(amount * 1.1);
    receiver.data.economy.bank = Number(receiver.data.economy.bank) + Number(amount);
    return Promise.all([sender.save(), receiver.save()])
    .then(() => {
      message.author.profile = sender;
      member.user.profile = receiver;
      parameters.assign({ '%AMOUNT%':  message.client.services.UTIL.NUMBER.separate(amount), '%MEMBER%': member.user.tag });
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'TRANSFER_SUCCS', parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
