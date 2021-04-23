require('moment-duration-format');
const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const { loadImage, createCanvas }             = require('canvas');

const moment  = require('moment');
const { API } = require('nhentai-api');
const api     = new API();

module.exports = {
  name             : 'nhentai',
  aliases          : [ 'gimmesauce', 'finddoujin', 'doujin', 'sauce', 'saucefor' ],
  cooldown         : { time: 3e4 },
  guildOnly        : false,
  nsfw             : true,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  group            : 'anime',
  description      : 'Fetch doujin information from <:nhentai:767062351169323039> [nHentai](https://nhentai.net "nHentai Homepage")',
  parameters       : [ 'Media ID' ],
  examples         : [ 'sauce 263492', 'gimmesauce 166258', 'finddoujin 177013', 'doujin 245212', 'nhentai 337864', 'saucefor 337879' ],
  run              : async (message, language, [id, read = '']) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix, '%ID%': id });

    if (isNaN(id) || id.split('.').length > 1){
      message.author.cooldown.delete('sauce');
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'NHENTAI_NOQUERY', parameters }));
    };

    message.channel.startTyping();

    const book = await api.getBook(id).catch(() => { return { status: 404 }});

    if (book.status){
      message.channel.stopTyping();
      parameters.assign({ '%QUERY%': 'Random Anime Query', '%SERVICE%': 'nHentai' });
      return message.reply(language.get({ '$in': 'ERRORS', id: book.status, parameters }));
    };

    const DICT      = language.getDictionary([ 'tags', 'pages', 'uploaded', 'code' ]);
    const { ARRAY } = message.client.services.UTIL;
    const rand      = Math.floor(Math.random() * book.pages.length - 2) + 1;
    const tags      = book.tags.sort((a,b) => a.name.localeCompare(b.name)).map(x => `[\`${x.name.toUpperCase()}\`](https://nhentai.net${x.url})`);
    const date      = moment(book.uploaded).locale(message.author.profile?.data.language||'en-us').format('do MMMM YYYY');
    const elapsed   = moment(book.uploaded).locale(message.author.profile?.data.language||'en-us').fromNow();
    const footer    = language.get({ '$in': 'COMMANDS', id: 'NHENTAI_EFOOTER' });

    message.channel.stopTyping();

    if (read.toLowerCase() === 'read'){
      if (message.author.reading){
        parameters.assign({ '%URL%': message.author.reading })
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'NHENTAI_READING', parameters }));
      } else {
        return new message.client.services.UTIL.Paginate(book.pages.map(page => {
          return new MessageEmbed()
          .setColor('RED')
          .setTitle(book.title.pretty)
          .setURL(`https://nhentai.net/g/${id}`)
          .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
          .setImage(`https://i.nhentai.net/galleries/${book.media}/${page.id}.${page.type.extension}`)
        }), message, {
          previousbtn        : '767062237722050561',
          nextbtn            : '767062244034084865',
          stopbtn            : '767062250279927818',
          removeUserReactions: message.type === 'dm' ? false : true,
          appendPageInfo     : true
        }).exec().then(pagination => {
          message.author.reading = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${pagination.message.id}`;
          return pagination.collector.once('end', () => message.author.reading = false );
        });
      };
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor('RED')
      .setTitle(book.title.pretty)
      .setURL(`https://nhentai.net/g/${id}`)
      .setDescription(`**${book.title.english}**\n*${book.title.japanese}*`)
      .setThumbnail(api.getImageURL(book.cover))
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      .addFields([
        { name: DICT.TAGS    , inline: false, value: ARRAY.join(tags)                          },
        { name: DICT.UPLOADED, inline: true , value: `${date} (*${elapsed}*)`, inline: true    },
        { name: DICT.CODE    , inline: true , value: `[**${id}**](https://nhentai.net/g/${id})`},
        { name: '\u200b'     , inline: false, value: language.get({ '$in': 'COMMANDS', id: 'NHENTAI_TIPS', parameters })}
      ])
    );
  }
};
