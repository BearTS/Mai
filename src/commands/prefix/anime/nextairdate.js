const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const moment                                  = require('moment');
                                                require('moment-duration-format');

module.exports = {
  name             : 'nextairdate',
  aliases          : [ 'nextairing', 'nextair', 'nextep', 'nextepisode' ],
  cooldown         : { time: 10000 },
  guildOnly        : true,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  group            : 'anime',
  description      : 'Shows the remaining time for the next episode of given anime. Returns the next three anime to air, if no anime is specified',
  parameters       : [ 'Search Query' ],
  examples         : [ 'nextairdate', 'nextair boruto', 'nextairing black clover', 'nextep attack on titan', 'nextepisode tensura' ],
  run              : async (message, language, args) => {

    const parameters       = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const query            = args.join(' ') || null;
    const variables        = query ? { search: query } : {};
    const GRAPHQL          = message.client.services.GRAPHQL;
    const { errors, data } = await message.client.anischedule.fetch(GRAPHQL[query ? 'AirDateQuery' : 'AirDateNoQuery'], variables);

    if (errors){
      parameters.assign({ '%QUERY%': query, '%SERVICE%': 'AniList', '%ERROR%': errors[0].message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: errors[0].status, parameters }));
    };

    const media  = [ data.Media || data.Page.media ].flat();
    const DICT   = language.getDictionary(['day(s)', 'hour(s)', 'minute(s)', 'and', 'unknown', 'airing', 'next', 'later', 'season finale']);
    const footer = language.get({ '$in': 'COMMANDS', id: 'NEXTAIRDATE_FOO' });

    if (query){
      const altTitles       = Object.values(media[0].title).filter(Boolean).slice(1).join('\n');
      const seasonFinale    = media[0].episodes &&  media[0].episodes === media[0].nextAiringEpisode?.episode ? ` ${DICT['SEASON FINALE']}` : '';
      const timeUntilAiring = moment.duration(media.nextAiringEpisode?.timeUntilAiring, 'seconds').format(`D [${DICT['DAY(S)']}] H [${DICT['hour(s)']} [${DICT.AND[0].toLowerCase() + DICT.AND.slice(1)}] m [${DICT['MINUTE(S)']}]`);
      const anime           = `[${media[0].title.english || media[0].title.romaji}](${media[0].siteUrl})`;
      const studios         = `${media[0].id}\u2000|\u2000${media[0].studios.edges.map(x => `[${x.node.name}](${x.node.siteUrl})`).join('\u2000|\u2000') || '~'}`;
      const date            = media[0].startDate.year ? moment(new Date(...Object.values(media[0].startDate))).locale(message.author.profile?.data.language).format(`${media[0].startDate.day ? 'Do ' : ''}${media[0].startDate.month ? 'MMMM ' : ''}YYYY`) : DICT.UNKNOWN;
      const fromNow         = media[0].startDate.year ? moment(new Date(...Object.values(media[0].startDate))).locale(message.author.profile?.data.language).fromNow() : DICT.UNKNOWN;

      parameters.assign({ '%TIME%': timeUntilAiring, '%EPISODE%': media[0].episodes, '%FINALE%': seasonFinale , '%ANIME%': anime, '%DATE%': date, '%FROMNOW%': fromNow });

      const description = language.get({ '$in': 'COMMANDS', id: `NEXTAIRDATE_${media[0].status.slice(0,3)}`, parameters });

      return message.channel.send(
        new MessageEmbed()
        .setColor(media[0].coverImage.color)
        .setThumbnail(media[0].coverImage.large)
        .setTitle(Object.values(media[0].title).filter(Boolean)[0])
        .setDescription(altTitles + '\n\n' + description + '\n\n' + studios)
        .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      );
    } else {
      const [ now     , next     , later     ] = media.filter(x => x.nextAiringEpisode).sort((A,B) => A.nextAiringEpisode.timeUntilAiring - B.nextAiringEpisode.timeUntilAiring );
      const [ now_t   , next_t   , later_t   ] = [now, next, later].map(x => `[**${Object.values(x.title).filter(Boolean)[0]}**](${x.siteUrl})`);
      const [ now_at  , next_at  , later_at  ] = [now, next, later].map(x => Object.values(x.title).filter(Boolean).slice(1).map(x => `*${x}*`).join('\n'));
      const [ now_stu , next_stu , later_stu ] = [now, next, later].map(x => x.studios.edges.length ? `\n${x.studios.edges.map(x => `[${x.node.name}](${x.node.siteUrl})`).join('\u2000|\u2000')}` : '');
      const [ now_time, next_time, later_time] = [now, next, later].map(x => moment.duration(x.nextAiringEpisode.timeUntilAiring, 'seconds').format(`d [${DICT['DAY(S)']}] h [${DICT['HOUR(S)']}] m [${DICT['MINUTE(S)']}]`));
      const [ now_ep  , next_ep  , later_ep  ] = [now, next, later].map(x => x.nextAiringEpisode.episode === x.episodes ? `${x.episodes} (${DICT['SEASON FINALE']})` : x.episodes);

      return message.channel.send(
        new MessageEmbed()
        .setColor(now.coverImage.color)
        .setThumbnail(now.coverImage.large)
        .setTitle(DICT.AIRING)
        .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
        .setDescription(              now_t  + '\n' + now_at   + now_stu   + '\n' + language.get({ '$in': 'COMMANDS', id: 'NEXTAIRDATE_DES', parameters: parameters.assign({ '%EPISODE%': now_ep  , '%TIME%': now_time   })}) + '\n\u200b')
        .addFields([
          { name: DICT.NEXT , value: next_t  + '\n' + next_at  + next_stu  + '\n' + language.get({ '$in': 'COMMANDS', id: 'NEXTAIRDATE_DES', parameters: parameters.assign({ '%EPISODE%': next_ep , '%TIME%': next_time  })}) + '\n\u200b'},
          { name: DICT.LATER, value: later_t + '\n' + later_at + later_stu + '\n' + language.get({ '$in': 'COMMANDS', id: 'NEXTAIRDATE_DES', parameters: parameters.assign({ '%EPISODE%': later_ep, '%TIME%': later_time })}) + '\n\u200b'}
        ])
      );
    };
  }
};
