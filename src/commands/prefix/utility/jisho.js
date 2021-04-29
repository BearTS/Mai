const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const { toRomaji } = require('wanakana');
const fetch = require('node-fetch');

module.exports = {
  name             : 'jisho',
  description      : 'Searches for Japanese words and Kanji on Jisho!',
  aliases          : [ 'weebify', 'kanji', 'nipponify' ],
  cooldown         : { time: 1e4 },
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'utility',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'word <kana/romaji>' ],
  examples         : [  'jisho nani', 'nipponify oyasumi', 'weebify wakarimashita' ],
  run              : async (message, language, [query]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%QUERY%': query });

    if (!query){
      message.author.cooldown.delete('jisho');
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'JISHO_NOQUERY', parameters }));
    };

    const URI = `https://jisho.org/api/v1/search/words?keyword=${encodeURI(query)}`
    const res = await fetch(URI).then(res => res.ok ? res.json() : Promise.reject({ status: res.status })).catch(err => error);

    if (res.meta.status !== 200){
      return message.reply(language.get({ '$in': 'ERRORS', id: res.status, parameters: parameters.assign({ '%ERROR%': ''}) }));
    };

    if (!res.data.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'JISHO_NOHITS', parameters }));
    };

    const title  = language.get({ '$in': 'COMMANDS', id: 'JISHO_ETITLE' , parameters });
    const footer = language.get({ '$in': 'COMMANDS', id: 'JISHO_EFOOTER', parameters });
    const DICT   = language.getDictionary(['common word','uncommon word','kanji','romaji','definition','restrictions','notes', 'external link'])
    const fields = res.data.filter(d => d.attribution.jmdict ).splice(0,3).map(data => {
      const isCommon = data.is_Common ? DICT['COMMON WORD'] : DICT['UNCOMMON WORD'] ;
      const kanji    = data.japanese.map(m => `${m.word || ''} *"(${m.reading || ''})"*`).join(' • ');
      const romaji   = data.japanese.map(m => toRomaji(m.reading)).join(' ');
      const defs     = data.senses[0].english_definitions;
      const restrict = data.senses[0].restrictions.join('\n') || 'None' +'\n'
      const notes    = [...data.senses[0].tags, ...data.senses[0].info].join(' • ');
      const value    = [
        `**${data.slug        }** - ${isCommon}`,
        `**${DICT.KANJI       }** - ${kanji   }`,
        `**${DICT.ROMAJI      }** - ${romaji  }`,
        `**${DICT.DEFINITION  }** - ${defs    }`,
        `**${DICT.RESTRICTIONS}** - ${restrict}`,
        `**${DICT.NOTES       }** - ${notes   }`
      ].join('\n');
      return { name: '\u200b', inline: true, value };
    })

    return message.channel.send(
      new MessageEmbed()
      .setColor(0xe620a4)
      .addFields(fields).setAuthor(title)
      .addField('\u200b',`[${DICT['EXTERNAL LINK']}](https://jisho.org/search/${query} '${query} on Jisho')`)
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
    );
  }
};
