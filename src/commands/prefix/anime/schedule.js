const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const fetch  = require('node-fetch');
const moment = require('moment');

module.exports = {
  name             : 'schedule',
  aliases          : [ 'anitoday' , 'airinglist' , 'airing' ],
  cooldown         : { time: 6e4 },
  guildOnly        : false,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.ADD_REACTIONS, FLAGS.USE_EXTERNAL_EMOJIS ],
  group            : 'anime',
  description      : 'Displays the list of currently airing anime for today\'s date or given weekday',
  parameters       : [ 'Weekday' ],
  examples         : [  'schedule monday', 'anitoday', 'airinglist sunday', 'airing saturday' ],
  run              : async (message, language, [ day ]) => {

    const weekday    = day             ? day.toLowerCase() : new Date().getDay();
          day        = isNaN(weekday)  ? weekday           : message.client.anischedule.info.weeks[weekday];
          parameters = new language.Parameter({ '%AUTHOR%' : message.author.tag });

    const URI        = 'https://api.jikan.moe/v3/schedule/' + encodeURIComponent(day);
    const data       = await fetch(URI).then(res => res.json()).catch(err => {return { error:  { status: 500, message: err.message }}});

    if (data.error || data.message){
      parameters.assign({ '%QUERY%': day, '%SERVICE%': 'MyAnimeList (via Jikan)', '%ERROR%': data.error.message || data.error });
      return message.reply(language.get({ '$in': 'ERRORS', id: data.error.status || 404 , parameters }));
    };

    const DICT       = language.getDictionary([ 'score', 'type', 'unknown', 'started', 'source', 'producers', 'licensors' ]);
    const footer     = language.get({ '$in': 'COMMANDS', id: 'SCHEDULE_EFOOTE' });
    const { STRING } = message.client.services.UTIL;

    return new message.client.services.UTIL.Paginate(data[day].map(entry => {
      const score    = entry.score ? `**${DICT.SCORE}**:\u2000${entry.score}\n` : '';
      const genres   = entry.genres.map(x => `[${x.name}](${x.url})`).join(' • ');
      const synopsis = STRING.truncate(entry.synopsis, 300, `...[Read More](${entry.url})`);
      const locale   = message.author.profile?.data.language || 'en-us';
      return new MessageEmbed()
      .setColor(0xe620a4)
      .setTitle(entry.title)
      .setURL(entry.url)
      .setThumbnail(entry.image_url)
      .setDescription(score + genres + '\n\n' + synopsis + '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      .addFields([
        { name: DICT.TYPE     , value: entry.type                  || DICT.UNKNOWN                                 , inline: true },
        { name: DICT.STARTED  , value: moment(entry.started).locale(locale).format('Do MMMM YYYY')                , inline: true },
        { name: DICT.SOURCE   , value: entry.source                || DICT.UNKNOWN                                 , inline: true },
        { name: DICT.PRODUCERS, value: entry.producers.map(x => `[${x.name}](${x.url})`).join(' • ') || DICT.UNKOWN, inline: true },
        { name: DICT.LICENSORS, value: entry.licensors.join(' • ') || DICT.UNKNOWN                                 , inline: true },
        { name: '\u200b'      , value: '\u200b'                                                                   , inline: true }
      ])
    }), message, {
      previousbtn        : '767062237722050561',
      nextbtn            : '767062244034084865',
      stopbtn            : '767062250279927818',
      removeUserReactions: message.type === 'dm' ? false : true,
      appendPageInfo     : true
    }).exec()
  }
};
