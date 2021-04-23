const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const { HAnimeAPI }                           = require('hanime');
const moment                                  = require('moment');
const hanime                                  = new HAnimeAPI();

moment.suppressDeprecationWarnings = true;

module.exports = {
  name             : 'hanime',
  aliases          : [ 'searchhentai', 'hanisearch', 'hs' ],
  cooldown         : { time: 10000 },
  guildOnly        : false,
  requiresDatabase : false,
  rankcommand      : false,
  nsfw             : true ,
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.MANAGE_MESSAGES ],
  group            : 'anime',
  description      : 'Queries hanime.tv for a specific hentai. Returns a maximum of 10 results',
  parameters       : [ 'Search Query' ],
  examples         : [ 'hanime saimin seishidou', 'searchhentai mankitsu happening', 'hanisearch dropout', 'hs tamashii insert'],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const query      = args.join(' ');

    if (!query){
      message.author.cooldown.delete('hanime');
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'HANIME_NOQUERY', parameters }));
    };

    const res = await hanime.search(query);

    if (!res.hits){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'HANIME_NOHITS', parameters }));
    };

    const { Paginate, NUMBER, STRING } = message.client.services.UTIL;

    const footer = language.get({ '$in': 'COMMANDS', id: 'HANIME_EFOOTER' });
    const DICT   = language.getDictionary(['released', 'rank', 'downloads', 'likes', 'interests', 'views', 'unranked'])
    const pages  = res.videos.splice(0,10).map((entry, i, a) => {
      const likes = Math.round((entry.likes / (entry.likes + entry.dislikes)) * 100);
      const desc  = STRING.truncate(entry.description.replace(/&#?[a-z0-9]+;|<([^>]+)>/ig, ''), 500);
      const watch = language.get({ '$in': 'COMMANDS', id: 'HANIME_WATCH', parameters: parameters.assign({ '%CENSORSHIP%': entry.is_censored ? 'CENSORED' : 'UNCENSORED', '%SLUG%': entry.slug })});
      return new MessageEmbed()
      .setColor('RED')
      .setTitle(entry.name)
      .setURL(`https://hanime.tv/videos/hentai/${entry.slug}`)
      .setImage(entry.poster_url)
      .setThumbnail(entry.cover_url)
      .setAuthor('hanime.tv', 'https://i.imgur.com/fl2V0QV.png','https://hanime.tv/')
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      .setDescription(`[**${entry.brand}**](https://hanime.tv/browse/brands/${entry.brand.toLowerCase().replace(/ +/gi, '\-')})\n\n${entry.tags.sort().map(x => `[\`${x.toUpperCase()}\`](https://hanime.tv/browse/tags/${encodeURI(x)})`).join(' ')}`)
      .addFields([
        { name: DICT.RELEASED              , value: moment(new Date(entry.released_at * 1000)).locale(message.author.profile?.data.language || 'en-us').format('dddd, do MMMM YYYY'), inline: true  },
        { name: DICT.RANK                  , value: NUMBER.ordinalize(entry.monthly_rank).replace(/(?<![\d]{1,})0th/, DICT.UNRANKED)                                                , inline: true  },
        { name: DICT.DOWNLOADS             , value: NUMBER.separate(entry.downloads)                                                                                                , inline: true  },
        { name: `${DICT.LIKES} (${likes}%)`, value: NUMBER.separate(entry.likes)                                                                                                    , inline: true  },
        { name: DICT.INTERESTS             , value: NUMBER.separate(entry.interests)                                                                                                , inline: true  },
        { name: DICT.VIEWS                 , value: NUMBER.separate(entry.views)                                                                                                    , inline: true  },
        { name: '\u200b'                   , value: desc + '\n\n' + watch                                                                                                           , inline: false }
      ]);
    });

    if (pages.length < 2){
      return message.channel.send(pages[0]);
    } else {
      return new Paginate(pages, message, {
        previousbtn:         '767062237722050561',
        nextbtn:             '767062244034084865',
        stopbtn:             '767062250279927818',
        removeUserReactions: message.type === 'dm' ? false : true,
        appendPageInfo     : true
      }).exec();
    };
  }
};
