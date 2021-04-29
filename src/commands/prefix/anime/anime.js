const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const { getInfoFromName } = require('mal-scraper');
const moment = require('moment');

moment.suppressDeprecationWarnings = true;

module.exports = {
  name             : 'anime',
  aliases          : [ 'ani', 'as', 'anisearch'],
  cooldown         : { time: 10000 },
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  group            : 'anime',
  description      : 'Searches for a specific anime in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net "Homepage"), or shows Mai\'s anime series information if no query is provided.',
  parameters       : [ 'Search Query' ],
  examples         : [ 'anime', 'as seishun buta yarou', 'ani aobuta', 'anisearch bunnygirl senpai' ],
  run              : async (message, language, args) => {

    const query = args.join(' ') || 'Seishun Buta Yarou';
    const parameters = new language.Parameter({
      '%AUTHOR%': message.author.tag,
      '%QUERY%': query
    });

    message.channel.startTyping();

    const data = await new Promise((resolve,reject) => {
      setTimeout(() => reject('TIMEOUT'), 10000);

      return getInfoFromName(query)
      .then(res => resolve(res))
      .catch(err => reject(err));
    }).catch((err)=> err !== 'TIMEOUT' ? null : err);

    if (!data){
      const no_data_response = language.get({'$in': 'COMMANDS', id: 'ANIME_NO_DATA', parameters });
      return message.reply(no_data_response).then(() => message.channel.stopTyping());
    } else if (data === 'TIMEOUT'){
      const timeout_response = language.get({'$in': 'ERRORS', id: 408..toString() ,parameters: parameters.assign({'%SERVICE%': 'MyAnimeList'})});
      return message.reply(timeout_response).then(() => message.channel.stopTyping());
    };

    message.channel.stopTyping();

    const isHentai = data.genres.some(x => x === 'Hentai');
    const nsfwch = message.guild.channels.cache.filter(x => x.nsfw).map(x => x.toString());

    if (isHentai && message.channel.nsfw === false){
      const nsfw_response = language.get({ '$in': 'COMMANDS', id: 'ANIME_NONNSFW', parameters: parameters.assign({
        '%ANIME_STUDIO%': data.studios?.[0] || 'Unknown Publisher',
        '%NSFW_CHANNELS%': nsfwch.length ? ` such as ${message.client.services.UTIL.ARRAY.join(nsfwch)}` : ''
      })});
      return message.reply(nsfw_response);
    };

    const { NUMBER, STRING, ARRAY } = message.client.services.UTIL;
    const DICT = language.getDictionary(['source','episodes','duration','type','premiered','studio','currently airing','airs on','producers','rating','unknown', 'read synopsis', 'read more on']);
    const response = new MessageEmbed()
    .setURL(data.url)
    .setColor(isHentai ? 'RED' : 0xe620a4)
    .setThumbnail(data.picture || null)
    .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'ANIME_EFOOTER'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
    .setTitle(STRING.truncate(data.englishTitle || data.title, 200))
    .setDescription([
      [
        `[\\⭐](https://myanimelist.net/anime/${data.id}/stats 'Score'): ${data.score}`,
        `[\\🏅](https://myanimelist.net/info.php?go=topanime 'Rank'): ${isNaN(data.ranked.slice(1)) ? 'N/A' : NUMBER.ordinalize((data.ranked).slice(1))}`,
        `[\\✨](https://myanimelist.net/info.php?go=topanime 'Popularity'): ${data.popularity || '~'}`,
        `[\` ▶ \`](${data.trailer} 'Watch Trailer')`
      ].join('\u2000\u2000•\u2000\u2000'),
      `\n${ARRAY.join(data.genres.map(g =>
        `[${g}](https://myanimelist.net/anime/genre/${message.client.services.MAL.genres[g.toLowerCase()]})`
      )||[])}`,
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    ].filter(Boolean).join('\n'))
    .addFields([
      { name: DICT.SOURCE,                   inline: true,  value: data.source ? [data.source].map(x => `[**${x}**](https://myanimelist.net/topmanga.php?type=${message.client.services.MAL.sources[x] || 'manga'})`)[0] : `**${DICT.UNKNOWN}**`                                     },
      { name: DICT.EPISODES,                 inline: true,  value: `[**${data.episodes}**](https://myanimelist.net/anime/${data.id}/_/episode)`                                                                                                                                      },
      { name: DICT.DURATION,                 inline: true,  value: data.duration || DICT.UNKNOWN                                                                                                                                                                                     },
      { name: DICT.TYPE,                     inline: true,  value: data.type ? `[**${data.type}**](https://myanimelist.net/topanime.php?type=${encodeURI(data.type.toLowerCase())})` : '**showType Unavailable**'                                                                    },
      { name: DICT.PREMIERED,                inline: true,  value: data.premiered && data.premiered !== '?' ? `[**${data.premiered}**](https://myanimelist.net/anime/season/${data.premiered.split(' ')[1]}/${data.premiered.split(' ')[0]?.toLowerCase()})` : `**${DICT.UNKNOWN}**` },
      { name: DICT.STUDIO,                   inline: true,  value: `[**${data.studios?.[0]}**](https://myanimelist.net/anime/producer/${message.client.services.MAL.producers[data.studios?.[0]]}/)` || `**${DICT.UNKNOWN}**`                                                        },
      { name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━', inline: false, value: STRING.truncate(data.synopsis||DICT['NO SYNOPSIS'], 500, `...\n\n[**\`📖 ${DICT['READ SYNOPSIS']}\`**](${data.url} '${DICT['READ MORE ON']}: MyAnimeList')`)                                                      },
      { name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━', inline: false, value: [
          `**${data.status === 'Finished Airing' ? 'Aired' : data.status === 'Currently Airing' ? DICT['CURRENTLY AIRING'] : DICT['AIRS ON']} (*${moment(data.aired.split('to')[0], 'll').locale(message.author.language || '').fromNow()}*):** ${data.aired || DICT.UNKNOWN}`,
          '',
          `**${DICT.PRODUCERS}**: ${STRING.truncate(ARRAY.join(data.producers?.map(x => x === 'None found, add some' ? x : `[${x}](https://myanimelist.net/anime/producer/${message.client.services.MAL.producers[x]}/)`)||[]) || DICT.UNKNOWN ,900, '...')}`,
          '',
          `**${DICT.RATING}**: *${data.rating.replace('None', '') || 'Unrated'}*`,
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        ].join('\n')
      }
    ]);

    return message.channel.send(response);
  }
};
