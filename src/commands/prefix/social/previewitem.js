const { Permissions: { FLAGS }} = require('discord.js');

const { join } = require('path');
const market   = require(join(__dirname, '../../../', 'assets/json/market.json'));

module.exports = {
  name             : 'previewitem',
  description      : 'Check what you can buy from the shop.',
  aliases          : [ 'viewitem' ],
  cooldown         : { time: 3e3 },
  clientPermissions: [ FLAGS.MANAGE_MESSAGES, FLAGS.ATTACH_FILES ],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : false,
  group            : 'social',
  parameters       : [],
  examples         : [],
  run              : async (message, language, [id]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%ID%': id });

    if (!id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'PREVIEWITEM_XID', parameters }));
    };

    let selected = market.find(x => x.id == id);

    if (!selected){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'PREVIEWITEM_XIT', parameters }));
    };

    const DICT = language.getDictionary([ 'name', 'type', 'price', 'background', 'pattern', 'wreath', 'emblem', 'hat' ]);

    return message.channel.send(`${DICT.NAME}: **${selected.name}**, ${DICT.TYPE}: **${DICT[selected.type.toUpperCase()]}**, ${DICT.PRICE}: **${message.client.services.UTIL.NUMBER.separate(selected.price)}**`,{
      embed: { image: { url: selected.assets.link }, color: 0xe620a4 }
    });
  }
};
