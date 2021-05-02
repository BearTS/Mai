const { join } = require('path');
const market   = require(join(__dirname, '../../../', 'assets/json/market.json'));

module.exports = {
  name             : 'deleteitem',
  description      : 'Deletes an item you own.',
  aliases          : [],
  cooldown         : { time: 3e3 },
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'item ID', 'amount' ],
  examples         : [ 'deleteitem 10', 'deleteitem 18 2' ],
  run              : async (message, language, [id, amount = 1]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix, '%ID%': id });

    if (!id || isNaN(id)){ // The id is invalid
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'DELETEITEM_NVID', parameters }));
    };

    if (isNaN(amount) || amount < 1){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'DELETEITEM_EAMT', parameters }));
    };

    const item   = market.find(x => x.id == id);

    if (!item){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'DELETEITEM_NITM', parameters }));
    };

    parameters.assign({ '%ITEMNAME%': item.name, '%AMOUNT%': amount });

    if (!item.deletable){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'DELETEITEM_NDEL', parameters }));
    };

    const document = message.author.profile || await profile.findById(message.author.id) || new profile({ _id: message.author.id });

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    const itemcount = document.data.profile.inventory.find(x => x.id === item.id)?.amount;

    if (!itemcount || amount > itemcount){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'DELETEITEM_INVC', parameters }));
    };

    const index = document.data.profile.inventory.findIndex(x => x.id === item.id);
    const _item = document.data.profile.inventory.splice(index, 1)[0];

    _item.amount -= amount;

    if (_item.amount > 0) document.data.profile.inventory.push(_item);

    const proceed = await message.channel.send(language.get({ '$in': 'COMMANDS', id: 'DELETEITEM_PRMT', parameters })).then(() => {
      const choices = ['y', 'yes', 'n', 'no'];
      const filter  = _message => message.author.id === _message.author.id && choices.includes(_message.content.toLowerCase());
      const options = { max: 1, time: 30000, errors: ['time'] };
      return message.channel.awaitMessages(filter, options)
      .then((c) => ['y','yes'].includes(c.first().content.toLowerCase()) ? true : false)
      .catch(() => false);
    });

    if (!proceed){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'DELETEITEM_CNCL', parameters }));
    };

    return document.save()
    .then(document => {
      message.author.profile = document;
      parameters.assign({ '%ITEM%': item.name });
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'DELETEITEM_SCCS', parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
