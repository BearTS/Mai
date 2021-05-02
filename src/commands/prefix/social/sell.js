const { join } = require('path');
const market   = require(join(__dirname, '../../../', 'assets/json/market.json'));

module.exports = {
  name             : 'sell',
  description      : 'Sell some of your items to the shop.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'Item ID', 'Amount' ],
  examples         : [ 'sell 10', 'sell 18 2' ],
  run              : async (message, language, [id, amount = 1]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });

    if (!id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SELL_NO_ID', parameters }));
    };

    const item = market.find(x => x.id == id);

    parameters.assign({ '%ID%': id, '%AMOUNT%': amount });
    if (!item){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SELL_INVALID_ID', parameters }));
    };

    parameters.assign({ '%ITEMNAME%': item.name });

    if (!amount || isNaN(amount)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SELL_INVALID_AM', parameters }));
    };

    amount = Math.floor(Math.abs(amount));

    if (!item.price && amount > 1){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SELL_MULT_FREE', parameters }));
    };

    const totalprice = Math.floor(Math.abs(item.price) * amount * 0.7);

    const profileDB = message.client.database.Profile;
    const document  = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id });

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    const itemcount = document.data.profile.inventory.find(x => x.id === item.id)?.amount;

    if (!itemcount || amount > itemcount){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'SELL_INVCOUNT', parameters }));
    };

    const index = document.data.profile.inventory.findIndex(x => x.id === item.id);
    const _item = document.data.profile.inventory.splice(index, 1)[0];

    _item.amount -= amount;

    if (_item.amount > 0) document.data.profile.inventory.push(_item);

    document.data.economy.bank += totalprice;

    return document.save()
    .then(document => {
      message.author.profile = document;
      parameters.assign({ '%ITEM%': item.name, '%TOTALPRICE%': totalprice });
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'SELL_SUCCESS', parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
