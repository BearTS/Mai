const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const { join } = require('path');
const market   = require(join(__dirname, '../../../', 'assets/json/market.json'));

module.exports = {
  name             : 'buy',
  description      : 'Buy items from the shop.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [ FLAGS.MANAGE_MESSAGES ],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : false,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'Item ID', 'Amount' ],
  examples         : [ 'buy 10', 'buy 18 2' ],
  run              : async (message, language, [id, amount = 1]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });

    if (!id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BUY_NO_ID', parameters }));
    };

    const item = market.find(x => x.id == id);

    parameters.assign({ '%ID%': id, '%AMOUNT%': amount });
    if (!item){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BUY_INVALID_ID', parameters }));
    };

    if (!amount || isNaN(amount)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BUY_INVALID_AMT', parameters }));
    };

    amount = Math.floor(Math.abs(amount));

    if (!item.price && amount > 1){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BUY_MULT_FREE', parameters }));
    };

    const totalPayable  = item.price * amount;

    const profileDB = message.client.database.Profile;
    const document  = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id });

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    if (document.data.economy.bank < totalPayable){           // NEC => Not Enough Credits
      const req = totalPayable - document.data.economy.bank;
      parameters.assign({ '%REQUIRED%': message.client.services.UTIL.NUMBER.separate(req)});
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BUY_NEC', parameters }));
    };

    const index = document.data.profile.inventory.findIndex(x => x.id === item.id);
    const _item = document.data.profile.inventory.splice(...[index < 0 ? [0,0] : [index,1]].flat())[0];

    if (index > 0 && item.price === 0){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BUY_MULT_FREE', parameters }))
    };

    document.data.profile.inventory.push({ id: item.id, amount: _item?.amount + amount || amount });
    document.data.economy.bank -= totalPayable;

    return document.save()
    .then(document => {
      message.author.profile = document;
      parameters.assign({ '%ITEM%': item.name });
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'BUY_SUCCESSFUL', parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
