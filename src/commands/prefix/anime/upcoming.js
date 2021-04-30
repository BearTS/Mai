const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const fetch = require('node-fetch');
const     _ = require('lodash');

const types = [ 'TV', 'ONA', 'OVA', 'Movie', 'Special', '-' ];

module.exports = {
  name             : 'upcoming',
  aliases          : [],
  cooldown         : { time: 3e4 },
  guildOnly        : false,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.USE_EXTERNAL_EMOJIS, FLAGS.ADD_REACTIONS, FLAGS.MANAGE_MESSAGES, FLAGS.READ_MESSAGE_HISTORY ],
  group            : 'anime',
  description      : 'Displays the list of upcoming anime!',
  parameters       : [ 'Anime Media Type' ],
  examples         : [ 'upcoming', 'upcoming tv', 'upcoming ona', 'upcoming ova', 'upcoming movie', 'upcoming special', 'upcoming -'],
  run              : async (message, language, [type]) => {

    const { STRING, ARRAY, Paginate } = message.client.services.UTIL;
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%TYPES%': ARRAY.join(types.map(x => `\`${x}\``)), '%TYPE%': type?.toUpperCase() });

    if (!type || !types.includes(type.toUpperCase())){
      message.author.cooldown.delete('upcoming');
      return message.reply(language.get({'$in': 'COMMANDS', id: 'UPCOMING_NOTYPE', parameters }));
    };

    const res = await fetch(`https://api.jikan.moe/v3/season/later`).then(res => res.json()).catch(err =>{ return { status: 500 ,message: err.message }});

    if (res.status){
      parameters.assign({ '%ERROR%': res.message, '%SERVICE%': 'MyAnimeList (via Jikan)', 'QUERY': type });
      return message.reply(language.get({ '$in': 'ERRORS', id: res.status, parameters }));
    };

    const chunks       = 8;
    const descriptions = _.chunk(res.anime.filter(x => x.type.toLowerCase() === type.toLowerCase()).map(anime => STRING.truncate(`[**${anime.title}**](https://myanimelist.net/anime/${anime.mal_id})\n${ARRAY.join(anime.genres.map(x => `\`${x.name}\``))}\n${anime.synopsis.replace(/\r\n|\(No synopsis yet.\)/g,'')}`, Math.floor(2000 / chunks))), chunks);
    const footer       = language.get({ '$in': 'COMMANDS', id: 'UPCOMING_EFOOTE'});
    const header       = language.get({ '$in': 'COMMANDS', id: 'UPCOMING_HEADER', parameters });

    return new Paginate(descriptions.map(entry => new MessageEmbed()
      .setColor(0xe620a4)
      .setAuthor(header)
      .setDescription(entry.join('\n\n'))
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
    ), message, {
      previousbtn        : '767062237722050561',
      nextbtn            : '767062244034084865',
      stopbtn            : '767062250279927818',
      removeUserReactions: message.type === 'dm' ? false : true,
      appendPageInfo     : true
    }).exec();
  }
};
