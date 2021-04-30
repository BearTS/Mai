const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  name             : 'birdfact',
  description      : 'Generate a random useless bird facts.',
  aliases          : [ 'birdfacts', 'tori', 'bird' ],
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
  examples         : [ 'birdfacts', 'birdfact', 'tori', 'bird' ],
  run              : async (message, language) => {

    const data = await fetch('https://some-random-api.ml/facts/bird').then(res => res.json()).catch(err => err);

    if (data instanceof Error){
      const parameters = new language.Parameter({ '%ERROR%': data.message, '%AUTHOR%': message.author.tag });
      return message.reply(language.get({ '$in': 'ERRORS', id: data.name, parameters }));
    };
    if (!data || (!data.fact && !data.error)){
      const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%SERVICE%': 'Birdfact API' });
      return message.reply(language.get({ '$in': 'ERRORS', id: '503', parameters }));
    };
    if (data.error){
      const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%SERVICE%': 'Birdfact API', '%QUERY%': 'Birdfacts' });
      return message.reply(language.get({ '$in': 'ERRORS', id: '429', parameters }));
    };
    return message.channel.send(
      new MessageEmbed().setColor(0xe620a4).setDescription(data.fact).setThumbnail('https://i.imgur.com/arkxS3f.gif')
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'BIRDFACT_EFOOTR'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
   );
  }
};
