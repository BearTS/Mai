const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  name             : 'pandafact',
  description      : 'Generate a random useless panda facts.',
  aliases          : [ 'pandafacts', 'pf' ],
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
  parameters       : [],
  examples         : [ 'pandafacts', 'pandafact', 'pf' ],
  run              : async (message, language) => {

    const data       = await fetch('https://some-random-api.ml/facts/panda').then(res => res.json()).catch(err => err);
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    if (data instanceof Error){
      parameters.assign({ '%ERROR%': data.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: data.name, parameters }));
    };
    if (!data || (!data.fact && !data.error)){
      parameters.assign({ '%SERVICE%': 'Meme API' });
      return message.reply(language.get({ '$in': 'ERRORS', id: '503', parameters }));
    };
    if (data.error){
      parameters.assign({ '%SERVICE%': 'Birdfact API', '%QUERY%': 'Birdfacts' });
      return message.reply(language.get({ '$in': 'ERRORS', id: '429', parameters }));
    };
    return message.channel.send(
      new MessageEmbed().setColor(0xe620a4).setDescription(data.fact).setThumbnail('https://i.imgur.com/QUF4VQX.gif')
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'PANDAFACT_EFTR'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
   );
  }
};
