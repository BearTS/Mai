const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const _                                       = require('lodash');
const { join }                                = require('path');
const moment                                  = require('moment');
const ANIMEDATABASE                           = require(join(__dirname,'../../../assets/json/anime.json'));
const MANGADATABASE                           = require(join(__dirname,'../../../assets/json/manga.json'));

moment.suppressDeprecationWarnings = true;

module.exports = {
  name             : 'discover',
  aliases          : [],
  cooldown         : null,
  guildOnly        : false,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.USE_EXTERNAL_EMOJIS, FLAGS.ADD_REACTIONS, FLAGS.MANAGE_MESSAGES ],
  group            : 'anime',
  description      : 'Generate a set of handpicked <Anime/Manga> recommendations for a user.',
  parameters       : [ 'Manga', 'Anime' ],
  examples         : [ 'discover anime', 'discover manga' ],
  run              : async (message, language, [ category = '']) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });

    if (!category || !['anime','manga'].includes(category.toLowerCase())){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'DISCOVER_INCCAT', parameters }));
    };

    if (message.author.anidiscovery === null || message.author.anidiscovery.expiry < Date.now()){
      const genres = message.client.anischedule.info.defaultgenres.filter(x => x !== 'Hentai');
      const ANIME  = Object.fromEntries(_.shuffle(genres).splice(0,5).map(x => [ x ]));
      const MANGA  = Object.fromEntries(_.shuffle(genres).splice(0,5).map(x => [ x ]));
      const anime  = Object.keys(ANIME).map(g => ANIME[g] = _.shuffle(ANIMEDATABASE.filter(x => x.genres.some(y => y === g)))[0].ids.al);
      const manga  = Object.keys(MANGA).map(g => MANGA[g] = _.shuffle(MANGADATABASE.filter(x => x.genres.some(y => y === g)))[0].ids.al);
      const res    = await message.client.anischedule.fetch(message.client.services.GRAPHQL.Discover, { ids: [...anime, ...manga] });

      if (res.errors){
        parameters.assign({ '%QUERY%': 'Discovery Query', '%SERVICE%': 'AniList', '%ERROR%': res.errors[0].message });
        return message.reply(language.get({ '$in': 'ERRORS', id: res.errors[0].status, parameters }));
      };

      message.author.anidiscovery = {
        expiry: Date.now() + 864e5,
        anime : { genres: ANIME, media: res.data.Page.media.filter(x => x.type === 'ANIME'), viewcount: 0},
        manga : { genres: MANGA, media: res.data.Page.media.filter(x => x.type === 'MANGA'), viewcount: 0}
      };
    };

    message.author.anidiscovery[category.toLowerCase()].viewcount++;

    parameters.assign({ '%TYPE%': category[0].toUpperCase() + category.slice(1).toLowerCase()        });
    parameters.assign({ '%VIEWCOUNT%': message.author.anidiscovery[category.toLowerCase()].viewcount });

    const { STRING, ARRAY, Paginate } = message.client.services.UTIL;

    const DICT     = language.getDictionary(['other titles', 'native', 'romaji', 'english', 'unknown', 'started', 'episodes', 'chapters', 'genres', 'volumes', 'no synopsis', 'read synopsis', 'duration', 'minutes'])
    const entries  = message.author.anidiscovery[category.toLowerCase()];
    const footer   = language.get({ '$in': 'COMMANDS', id: 'DISCOVER_EFOOT', parameters });
    const viewed   = language.get({ '$in': 'COMMANDS', id: 'DISCOVER_VIEWS', parameters });
    const _locale  = message.author.profile?.data.language || 'en-us'
    const _html    = /&#?[a-z0-9]+;|<([^>]+)>/ig;

    const _filter  = ([k,v])           => !!v;
    const _replace = (word)            => word === 'day' ? 'DD' : word === 'month' ? 'MM' : 'YYYY';
    const _reduce  = ([ak,av],[ck,cv]) => [ak + ck.replace(/(day)|(month)|(year)/i,_replace), av + String(cv).padStart(2,0)];
    const _sort    = ([a,b])           => a.localeCompare(b);

    const pages = Object.entries(message.author.anidiscovery[category.toLowerCase()].genres).map(([genre, id]) => {
      const entry   = message.author.anidiscovery[category.toLowerCase()].media.find(x => x.id === id);
      const _format = entry.startDate.year ? 'MMMM Do YYYY' : 'MMMM Do';
      return new MessageEmbed()
      .setThumbnail(entry.coverImage.large)
      .setColor(entry.coverImage.color || 'GREY')
      .setDescription(entry.studios.nodes.slice(0,1).map( x => `[${x.name}](${x.siteUrl})`).join('') || '')
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      .setAuthor(`${genre}\u2000|\u2000${STRING.truncate(Object.values(entry.title).filter(Boolean)[0])}\u2000|\u2000${message.client.anischedule.info.mediaFormat[entry.format]}`)
      .addFields([
        { name: DICT['OTHER TITLES']                                              , inline: false, value: Object.entries(entry.title).filter(([k,v]) => !!v ).map(([k,v]) => `•\u2000**${DICT[k.toUpperCase()]}**:\u2000${v}`)                                                                                                  },
        { name: DICT.GENRES                                                       , inline: false, value: ARRAY.join(entry.genres.map(x => `[${x}](https://myanimelist.net/anime/genre/${message.client.services.MAL.genres[x.toLowerCase()]})`)) || DICT.UNKNOWN                                                               },
        { name: DICT.STARTED                                                      , inline: true , value: moment(...Object.entries(entry.startDate).filter(_filter).sort(_sort).reduce(_reduce, ['','']).reverse()).locale(_locale).format(_format)                                                                             },
        { name: DICT[category.toLowerCase() === 'anime' ? 'EPISODES' : 'CHAPTERS'], inline: true , value: entry.episodes                                     || entry.chapters || DICT.UNKNOWN                                                                                                                                  },
        { name: DICT[category.toLowerCase() === 'anime' ? 'DURATION' : 'VOLUMES'] , inline: true , value: entry.duration ? `${entry.duration} ${DICT.MINUTES}`: entry.volumes  || DICT.UNKNOWN                                                                                                                                  },
        { name: '━━━━━━━━━━━━━━━━━━━━━━━━━━'                                      , inline: false, value: (STRING.truncate(entry.description.replace(_html, '') || DICT['NO SYNOPSIS'], 500, `...\n[**${DICT['READ SYNOPSIS']}**](https://myanimelist.net/anime/${entry.idMal})`) || '\u200b') + '\n━━━━━━━━━━━━━━━━━━━━━━━━━━' }
      ]);
    });

    const firstPage = new MessageEmbed()
    .setColor('GREY')
    .setTitle(language.get({ '$in': 'COMMANDS', id: 'DISCOVER_TITLE', parameters }))
    .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
    .setDescription(language.get({ '$in': 'COMMANDS', id: 'DISCOVER_DESC', parameters }))
    .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
    .addFields([
      { name: '\u200b', value: Object.keys(message.author.anidiscovery[category.toLowerCase()].genres).map(g => `\\🟢 ${g}`).join('\n') },
      { name: message.author.anidiscovery[category.toLowerCase()].viewcount > 1 ? viewed : '\u200b', value: '\u200b' },
      { name: '\u200b', value: 'Start Your Queue by clicking <:next:767062244034084865> below!!' }
    ]);

    return new Paginate([firstPage, ...pages], message, {
      nextbtn            : '767062244034084865',
      removeUserReactions: message.type === 'dm' ? false : true,
      includePrevBtn     : false,
      includeStopBtn     : false,
      disableLoop        : true,
    }).exec();
  }
};
