const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'emoji',
  description      : 'Display the larger version of the supplied emoji.',
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
  parameters       : [ 'emoji', '-s' ],
  examples         : [ 'emoji :exampleonly:' ],
  run              : async (message, language, args) => {

    const emoji      = args.join(' ').match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)?.[0] || '';
    const steal      = args.join(' ').split(emoji).map(x => x.match(/\-s/i)?.[0]).filter(Boolean)[0] || '';
    const url        = 'https://cdn.discordapp.com/emojis/' +  emoji.match(/\d{17,19}/)?.[0];
    const name       = emoji.match(/\w{2,32}/)?.[0];
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const footer     = language.get({ '$in': 'COMMANDS', id: 'EMOJI_EFOOTER' });
    const embed      = new MessageEmbed()
    .setColor('GREY')
    .setAuthor(name)
    .setImage('https://cdn.discordapp.com/emojis/' + emoji.match(/\d{17,19}/)?.[0])
    .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`);


    if (!emoji){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'EMOJI_NOEMOJI', parameters }));
    };

    if (!steal){
      return message.channel.send(embed);
    };

    if (steal && message.guild === null){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'EMOJI_ST_ONDM', parameters }), embed);
    };

    if (steal && !message.member.permissions.has(FLAGS.MANAGE_EMOJIS)){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'EMOJI_ST_PRMS', parameters }), embed);
    };

    parameters.assign({ '%EMOJI_NAME%': name })

    const authorlang = message.author.profile?.data.language || 'en-us';
    const lib        = message.client.services.LANGUAGE.getCommand('addemoji', authorlang);
    const msg        = await message.guild.emojis.create(url, name)
    .then(e    => lib.get({ '$in': 'COMMANDS', id: 'ADDEMOJI_SUCCES', parameters: parameters.assign({ '%EMOJI%': e.toString()}) }))
    .catch(err => lib.get({ '$in': 'COMMANDS', id: 'ADDEMOJI_FAILED'  , parameters: parameters.assign({ '%ERROR%': err.message }) }));

    return message.channel.send(msg, embed);
  }
};
