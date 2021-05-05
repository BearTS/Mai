const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const _        = require('lodash');
const { join } = require('path');
const market   = require(join(__dirname, '../../../', 'assets/json/market.json'));

module.exports = {
  name             : 'inventory',
  description      : 'Check your items.',
  aliases          : [ 'inv' ],
  cooldown         : { time: 3e3 },
  clientPermissions: [ FLAGS.MANAGE_MESSAGES, FLAGS.EMBED_LINKS, FLAGS.USE_EXTERNAL_EMOJIS ],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [],
  examples         : [],
  run              : async (message, language) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const document   = message.author.profile || await profile.findById(message.author.id) || new profile({ _id: message.author.id });

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    if (!document.data.profile.inventory.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'INVENTORY_NOINV', parameters}));
    };

    const title   = language.get({ '$in': 'COMMANDS', id: 'INVENTORY_ETITL', parameters });
    const DICT    = language.getDictionary([ 'inventory', 'type', 'selling price', 'use', 'sell', 'amount' ]);
    const getDict = (name) => language.getDictionary([name])[name.toUpperCase()];

    return new message.client.services.UTIL.Paginate(_.chunk(document.data.profile.inventory, 25).map((chunk, i, o) => {
      return new MessageEmbed()
      .setColor(0xe620a4)
      .setTitle(title)
      .setFooter(`${DICT.INVENTORY}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      .addFields(...chunk.sort((A,B) => A.id - B.id ).map(d => {
        const item = market.find(x => x.id == d.id);
        return { name: `\`[${item.id}]\` x${d.amount} ${item.name}`, inline: true, value: `${DICT.TYPE}: *${getDict(item.type)}*\n${DICT['SELLING PRICE']}: *${Math.floor(item.price * 0.7)}*\n${DICT.USE}: \`${message.client.prefix}use ${item.id}\`\n${DICT.SELL}: \`${message.client.prefix}sell ${item.id} [${DICT.AMOUNT}]\``}
      }));
    }), message, {
      previousbtn        : '767062237722050561',
      nextbtn            : '767062244034084865',
      stopbtn            : '767062250279927818',
      removeUserReactions: message.type === 'dm' ? false : true,
      appendPageInfo     : true
    }).exec();
  }
};
