const { join } = require('path');
const market   = require(join(__dirname, '../../../', 'assets/json/market.json'));

module.exports = {
  name             : 'equip',
  description      : 'Equip an item.',
  aliases          : [],
  cooldown         : { time: 3e3 },
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'item ID' ],
  examples         : [ 'equip 67' ],
  run              : async (message, language, [id]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix, '%ID%': id });

    // The ID is invalid
    if (!id || isNaN(id)){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'EQUIP_IDINVALID', parameters }));
    };
    const profileDB = message.client.database.Profile;
    const document  = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id });
    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };
    const meta = document.data.profile.inventory.find(x => x.id == id);
    // You don't have an item with the id
    if (!meta){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'EQUIP_NOITEM', parameters }));
    };
    const item = market.find(x => x.id == id);
    // No item found with the provided ID, cannot be equipped anymore.
    if (!item){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'EQUIP_XITEM', parameters }));
    };
    // Item is not equippable
    if (!['background', 'wreath', 'pattern', 'hat', 'emblem'].includes(item.type.toLowerCase())){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'EQUIP_UNEQUIPBL', parameters }));
    };
    document.data.profile[item.type.toLowerCase()] = item.assets.link;
    return document.save()
    .then(document => {
      message.author.profile = document;
      parameters.assign({ '%ITEMNAME%': item.name })
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'EQUIP_SUCCESS', parameters }));
    })
    .catch(error   => {
      parameters.assign({ '%ERROR%': error.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
