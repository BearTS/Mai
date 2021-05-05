const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const _        = require('lodash');
const { join } = require('path');
const market   = require(join(__dirname, '../../../', 'assets/json/market.json'));

module.exports = {
  name             : 'market',
  description      : 'Check what you can buy from the shop.',
  aliases          : [],
  cooldown         : { time: 3e3 },
  clientPermissions: [ FLAGS.MANAGE_MESSAGES, FLAGS.EMBED_LINKS, FLAGS.USE_EXTERNAL_EMOJIS ],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : false,
  group            : 'social',
  parameters       : [],
  examples         : [],
  run              : async (message, language, [type]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    let selected     = market.filter(x => x.type === type?.toLowerCase());

    if (!selected.length){
      selected = market;
    };

    const DICT        = language.getDictionary([ 'mai\'s market', 'market', 'type', 'price', 'check preview', 'purchase', 'amount' ]);
    const description = language.get({ '$in': 'COMMANDS', id: 'MARKET_DESC', parameters: parameters.assign({ '%WEBSITE%': 'https://market.mai-san.ml/' })});

    return new message.client.services.UTIL.Paginate(_.chunk(selected, 9).map((chunk, i, o) => {
      return new MessageEmbed()
      .setColor(0xe620a4)
      .setDescription(description)
      .setTitle(DICT['MAI\'S MARKET'])
      .setFooter(`${DICT.MARKET}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      .addFields(...chunk.map(item => { return { name: `\`[${item.id}]\` ${item.name}`, inline: true, value: `${item.description}\n${DICT.TYPE}: *${item.type}*\n${DICT.PRICE}: *${item.price}*\n${DICT['CHECK PREVIEW']}: \`${message.client.prefix}previewitem ${item.id}\`\n${DICT.PURCHASE}: \`${message.client.prefix}buy ${item.id} [${DICT.AMOUNT}]\`` }}));
    }), message, {
      previousbtn        : '767062237722050561',
      nextbtn            : '767062244034084865',
      stopbtn            : '767062250279927818',
      removeUserReactions: message.type === 'dm' ? false : true,
      appendPageInfo     : true
    }).exec()
  }
};
