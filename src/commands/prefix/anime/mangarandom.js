const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const { join }                                = require('path');
const moment                                  = require('moment');
const MANGADATABASE                           = require(join(__dirname,'../../../assets/json/manga.json'));

moment.suppressDeprecationWarnings = true;

module.exports = {
  name             : 'mangarandom',
  aliases          : [ 'mangarand', 'mangarecommend' ],
  cooldown         : { time: 10000 },
  guildOnly        : true,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  group            : 'anime',
  description      : 'Generates a random manga recommendation. Recommends a Hentai if used on a nsfw channel.',
  parameters       : [],
  examples         : [ 'anirandom', 'anirand', 'anirecommend' ],
  run              : async (message, language) => {

    // Indicator that Mai is trying to fetch these data
    message.channel.startTyping();

    const parameters         = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const database           = MANGADATABASE.filter(entry => message.channel.nsfw === entry.isAdult);
    const { ids: { al: id }} = database[Math.floor(Math.random() * database.length)];
    const { errors, data }   = await message.client.anischedule.fetch(message.client.services.GRAPHQL.Manga, { id });
    const { ARRAY, STRING }  = message.client.services.UTIL;
    const _locale            = message.author.profile?.data.language || 'en-us'
    const _format            = data.Media.startDate.year ? 'MMMM Do YYYY' : 'MMMM Do';
    const _html              = /&#?[a-z0-9]+;|<([^>]+)>/ig;

    const _filter  = ([k,v])           => !!v;
    const _replace = (word)            => word === 'day' ? 'DD' : word === 'month' ? 'MM' : 'YYYY';
    const _reduce  = ([ak,av],[ck,cv]) => [ak + ck.replace(/(day)|(month)|(year)/i,_replace), av + String(cv).padStart(2,0)];
    const _sort    = ([a,b])           => a.localeCompare(b);

    if (errors){
      parameters.assign({ '%QUERY%': 'Random Manga Query', '%SERVICE%': 'AniList', '%ERROR%': errors[0].message });
      return message.reply(language.get({ '$in': 'ERRORS', id: errors[0].status, parameters }));
    };

    const DICT = language.getDictionary(['other titles', 'native', 'romaji', 'english', 'genres', 'started', 'chapters', 'volumes', 'no synopsis', 'read synopsis'])
    return message.channel.send(
      new MessageEmbed()
      .setThumbnail(data.Media.coverImage.large)
      .setColor(data.Media.coverImage.color || 0xe620a4)
      .setDescription(data.Media.studios.nodes?.map(x => `[${x.name}](${x.url})`).join('\u2000|\u2000'))
      .setAuthor(`${Object.values(data.Media.title).filter(Boolean)[0]}\u2000|\u2000${message.client.anischedule.info.mediaFormat[data.Media.format]}`, null, data.Media.siteUrl)
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'MANGARANDOM_FOO' })}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
      .addFields([
        { name: DICT['OTHER TITLES']        , inline: false, value: Object.entries(data.Media.title).filter(([k,v]) => !!v && k!=='userPreferred').map(([k,v]) => `•\u2000**${DICT[k.toUpperCase()]}**:\u2000${v}`)                                                                                      },
        { name: DICT.GENRES                 , inline: false, value: ARRAY.join(data.Media.genres.map(x => `[${x}](https://myanimelist.net/manga/genre/${message.client.services.MAL.genres[x.toLowerCase()]})`)) || '\u200b'                                                                             },
        { name: DICT.STARTED                , inline: true , value: moment(...Object.entries(data.Media.startDate).filter(_filter).sort(_sort).reduce(_reduce, ['','']).reverse()).locale(_locale).format(_format)                                                                                       },
        { name: DICT.CHAPTERS               , inline: true , value: data.Media.chapters || DICT.UNKNOWN                                                                                                                                                                                                  },
        { name: DICT.VOLUMES                , inline: true , value: data.Media.volumes  || DICT.UNKNOWN                                                                                                                                                                                                  },
        { name: '━━━━━━━━━━━━━━━━━━━━━━━━━━', inline: false, value: (STRING.truncate((data.Media.description||'').replace(_html, '') || DICT['NO SYNOPSIS'], 500, `...\n[**${DICT['READ SYNOPSIS']}**](https://myanimelist.net/manga/${data.Media.idMal})`) || '\u200b') + '\n━━━━━━━━━━━━━━━━━━━━━━━━━━'},
      ]).setThumbnail(data.Media.coverImage.large)
   ).finally(() => message.channel.stopTyping());
  }
};
