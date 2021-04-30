const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

module.exports = {
  name             : 'manga',
  description      : 'Searches for a Manga / Manhwa / Manhua in MyAnimeList.net, or shows Seishun Buta Yarou if no query is provided.',
  aliases          : [],
  cooldown         : { time: 5000 },
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.USE_EXTERNAL_EMOJIS, FLAGS.ADD_REACTIONS, FLAGS.MANAGE_MESSAGES, FLAGS.READ_MESSAGE_HISTORY ],
  permissions      : [ ],
  group            : 'setup',
  parameters       : [],
  examples         : [],
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : false,
  run              : async (message, language, args) => {

    const query = args.join(' ') || 'Seishun Buta Yarou';
    const URI = `https://api.jikan.moe/v3/search/manga?q=${encodeURI(query)}&page=1`;
    const parameters = new language.Parameter({
      '%AUTHOR%': message.author.tag,
      '%QUERY%': query,
      '%SERVICE%': 'MyAnimeList (via Jikan)'
    });

    const data = await new Promise((resolve,reject) => {
      setTimeout(() => reject({ status: 408 }), 10000);
      return fetch(URI + (message.channel.nsfw === false ? '&genre=12&genre_exclude=0' : ''))
      .then(res => res.json()).then(res => resolve(res));
    }).catch((err) => err);

    if (!data.results){
      const response = language.get({ '$in': 'ERRORS', id: data.status, parameters });
      return message.reply(response);
    };

    if (!data.results.length){
      const response = language.get({ '$in': 'COMMANDS', id: 'MANGA_NO_DATA', parameters });
      return message.reply(response);
    };

    const DICT = language.getDictionary(['type','status','chapters','members','score','volumes','start date','end date','publishing','finished','unknown']);
    const { NUMBER, ARRAY, Paginate } = message.client.services.UTIL, USER_LOCALE = message.author.language, DATE_FORMAT = 'dddd, Do MMMM YYYY';
    const pages = data.results.slice(0,10).map(entry =>
      new MessageEmbed()
      .setAuthor   (entry.title, entry.image_url, entry.url)
      .setColor    (entry.type !== 'Doujinshi' ? 0xe620a4 : 'RED')
      .setThumbnail(entry.image_url)
      .setFooter   (`${language.get({ '$in': 'COMMANDS', id: 'MANGA_FOOTER'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
      .addFields   ([
          { name: DICT.TYPE,          value: entry.type,                                                                                         inline: true  },
          { name: DICT.STATUS,        value: entry.publishing ? DICT.PUBLISHING : DICT.FINISHED,                                                 inline: true  },
          { name: DICT.CHAPTERS,      value: entry.chapters,                                                                                     inline: true  },
          { name: DICT.MEMBERS,       value: NUMBER.separate(entry.members),                                                                     inline: true  },
          { name: DICT.SCORE,         value: entry.score,                                                                                        inline: true  },
          { name: DICT.VOLUMES,       value: entry.volumes,                                                                                      inline: true  },
          { name: DICT['START DATE'], value: entry.start_date ? moment(entry.start_date).locale(USER_LOCALE).format(DATE_FORMAT) : DICT.UNKNOWN, inline: true  },
          { name: DICT['END DATE'],   value: entry.end_date   ? moment(entry.end_date)  .locale(USER_LOCALE).format(DATE_FORMAT) : DICT.UNKNOWN, inline: true  },
          { name: '\u200b',           value: entry.synopsis || '\u200b',                                                                         inline: false }
        ])
      );

    return new Paginate(pages, message, {
      previousbtn:         '767062237722050561',
      nextbtn:             '767062244034084865',
      stopbtn:             '767062250279927818',
      removeUserReactions: message.type === 'dm' ? false : true,
      appendPageInfo:      true
    }).exec();
  }
};
