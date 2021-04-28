const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const { join } = require('path');
const urban    = require('relevant-urban');
const badwords = require('bad-words');
const filter   = new badwords();
const filtrstr = require(join(__dirname, '../../..', 'assets/json/filter.json'));

filter.addWords(...filtrstr);

module.exports = {
  name             : 'define',
  description      : 'Searches for your query on Urban Dictionary.\nNote: Using this on a nsfw channel disables the word profanity filter feature.',
  aliases          : [ 'urban', 'ud' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'utility',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'search query' ],
  examples         : [ 'define', 'urban anime' ],
  run              : async (message, language, args) => {

    const query      = args.join(' ') || 'Best Girl';
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%QUERY%': query });
    let   footer     = language.get({ '$in': 'COMMANDS', id: 'DEFINE_EFOOTER', parameters });
    let   title      = language.get({ '$in': 'COMMANDS', id: 'DEFINE_ETITLE' , parameters });
    const DICT       = language.getDictionary(['definition', 'examples', 'submitter']);

    if (!args.length) {
      return message.channel.send(new MessageEmbed()
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
      .setAuthor(`Urban Dictionary`,`https://files.catbox.moe/kkkxw3.png`,`https://www.urbandictionary.com/`)
      .setTitle(title).setColor('#e86222').setURL('https://ao-buta.com/tv/?innerlink')
      .addFields([
        { name: DICT.DEFINITION   , inline: false, value: 'No arguing, Mai Sakurajima indeed is the best anime girl!'                           },
        { name: DICT.EXAMPLES     , inline: false, value: '[Mai sakurajima] is the best girl around. No one could beat her, not even zero two.' },
        { name: '\u200b'          , inline: false, value: 'Submitted by Sakuta Azusagawa'                                                       }
      ]));
    };

    if (filter.isProfane(query) && !message.channel.nsfw && message.channel.type !== 'dm'){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'DEFINE_ISPROFAN', parameters }));
    };

    const hit = await urban(encodeURIComponent(query)).catch(() => {});

    if (!hit){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'DEFINE_NO_HITS', parameters }));
    };

    parameters.assign({
      '%QUERY%': hit.word
    });

    const { STRING } = message.client.services.UTIL;
    const isNSFWorDM = [ true, undefined ].includes(message.channel.nsfw);
    const definition = isNSFWorDM ? hit.definition    : filter.clean(hit.definition);
    const examples   = isNSFWorDM ? hit.example || '' : filter.clean(hit.example || '');
    const submitter  = isNSFWorDM ? hit.author  || '' : filter.clean(hit.author || '');
    const prof_name  = language.get({ '$in': 'COMMANDS', id: 'DEFINE_PROFANE', parameters });
    const prof_value = language.get({ '$in': 'COMMANDS', id: 'DEFINE_PROFANEB', parameters });
    const embed      = new MessageEmbed()
                      .setURL(hit.urbanURL).setColor('#e86222').setTitle(language.get({ '$in': 'COMMANDS', id: 'DEFINE_ETITLE' , parameters }))
                      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
                      .setAuthor('Urban Dictionary', 'https://files.catbox.moe/kkkxw3.png', 'https://www.urbandictionary.com/')
                      .addFields([
                        { name: DICT.DEFINITION, value: STRING.truncate(definition || 'N/A', 1000) },
                        { name: DICT.EXAMPLES  , value: STRING.truncate(examples   || 'N/A', 1000) },
                        { name: DICT.SUBMITTER , value: STRING.truncate(submitter  || 'N/A', 1000) }
                      ]);

    if (!isNSFWorDM){
      embed.addField(prof_name, prof_value)
    };

    return message.channel.send(embed);
  }
};
