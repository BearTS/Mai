const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

const horoscope = { cancer: '♋', aquarius: '♒', aries: '♈', taurus: '♉', virgo: '♍', scorpio: '♏', libra: '♎', gemini: '♊', leo: '♌', sagittarius: '♐', capricorn: '♑', pisces: '♓' };
const fetch     = require('node-fetch');

module.exports = {
  name             : 'horoscope',
  description      : 'Find out your horoscope for today!',
  aliases          : [],
  cooldown         : { time: 3e3 },
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'fun',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Horoscope Sign' ],
  examples         : [ 'horoscope libra', 'horoscope sagittarius' ],
  run              : async (message, language, [sign]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    if (!sign){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'HOROSCOPE_NOARG', parameters }));
    };
    if (!horoscope[sign.toLowerCase()]){
      parameters.assign({ '%SIGN%': sign });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'HOROSCOPE_NVARG', parameters }));
    };
    const result = await fetch(`http://sandipbgt.com/theastrologer/api/horoscope/${sign.toLowerCase()}/today`).then(res => res.json()).catch(err => err);
    if (result instanceof Error){
      parameters.assign({ '%ERROR%': data.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: data.name, parameters }));
    };
    if (!result.horoscope){
    parameters.assign({ '%SERVICE%': 'Horoscope API', '%QUERY%': 'Horoscope' });
      return message.reply(language.get({ '$in': 'ERRORS', id: '501', parameters }));
    };
    const footer = language.get({ '$in': 'COMMANDS', id: 'HOROSCOPE_EFTR' });
    const DICT   = language.getDictionary([ 'mood', 'intensity', 'keywords' ]);
    return message.channel.send(
     new MessageEmbed()
     .setColor(0xe620a4)
     .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
     .setAuthor(horoscope[sign.toLowerCase()] + ' ' + sign.toUpperCase())
     .setDescription(result.horoscope.replace('(c) Kelli Fox, The Astrologer, http://new.theastrologer.com', ''))
     .addFields([
       { name: DICT.MOOD     , inline: true, value: result.meta.mood      || '\u200b' },
       { name: DICT.INTENSITY, inline: true, value: result.meta.intensity || '\u200b' },
       { name: DICT.KEYWORDS , inline: true, value: result.meta.keywords  || '\u200b' }
     ])
   );
  }
};
