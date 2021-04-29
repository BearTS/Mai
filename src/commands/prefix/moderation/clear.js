const { Message, MessageEmbed, Permissions: { FLAGS }, Collection } = require('discord.js');

const moment = require('moment');

module.exports = {
  name             : 'clear',
  description      : 'Delete messages from this channel. Will not delete messages older than two (2) weeks.',
  aliases          : [ 'delete', 'slowprune', 'sd', 'slowdelete' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.MANAGE_MESSAGES, FLAGS.EMBED_LINKS ],
  permissions      : [ FLAGS.MANAGE_MESSAGES ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : false,
  parameters       : [ 'Quantity of Message' ],
  examples         : [ 'clear 10', 'delete 99', 'slowprune 50' ],
  run              : async (message, language, [qty]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    let   messages   = new Collection();
          qty        = Math.round(qty);

    if (isNaN(qty) || qty < 1){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'CLEAR_INVALIDQT', parameters }));
    };

    let value, amounts = Array.from({ length: Math.floor(qty/99) }, () => 99).concat([qty % 99]);
    const DICT         = language.getDictionary([ 'view', 'download']);

    message.channel.startTyping();

    while (value = amounts.splice(0,1)[0]){ // Add a 1.5 seconds interval between bulk delete to allow for API breathing
      const deleted = await message.channel.bulkDelete(value, true).then(col => new Promise(resolve => setTimeout(() => resolve(col), 1500)));
           messages = messages.concat(deleted);
      if (value > deleted.size) { amounts.length = 0 };
    };

    const size      = messages.size;
    const header    = `Messages Cleared on ![](${message.guild.iconURL({size: 32})}) **${message.guild.name}** - **#${message.channel.name}** --\r\n\r\n`;
    const _mapFn    = (message) => `[${moment(message.createdTimestamp).format('dddd, Do MMMM YYYY hh:mm:ss')}] ${message.author.tag} : ${message.content}\r\n\r\n`;
    const _filterFn = (message) => Boolean(message) && typeof message === 'object' && Object.values(message).length && message.createdAt && message.author;
          messages  = messages.filter(_filterFn).sort((a,b) => b.createdAt - a.createdAt).map(_mapFn).concat([header]).reverse().join('');

    const res       = size ? await message.client.channels.cache.get(message.client.uploadch)?.send({ files: [{ attachment: Buffer.from(messages), name: 'BULKDELETE.txt' }] }).catch(() => {}) : undefined;
    const view      = res  ? `[\`📄 ${DICT.VIEW}\`](https://txt.discord.website/?txt=${message.client.uploadch}/${res.attachments.first().id}/BULKDELETE)` : '';
    const download  = res  ? `[\`📩 ${DICT.DOWNLOAD}\`](${res.attachments.first().url})` : '';

    message.channel.stopTyping();

    const response = language.get({ '$in': 'COMMANDS', id: 'CLEAR_SUCCESS', parameters: parameters.assign({ '%COUNT%': size }) });

    return message.channel.send(response, res ? new MessageEmbed()
      .setColor(0xe620a4)
      .setDescription(view + '\u2000\u2000•\u2000\u2000' + download) : {}
    );
  }
};
