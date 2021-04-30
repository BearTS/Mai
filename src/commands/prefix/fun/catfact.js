const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  name             : 'catfacts',
  description      : 'Generate a random useless cat facts.',
  aliases          : [ 'birdfact', 'tori', 'bird' ],
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
  examples         : [ 'catfacts', 'catfact', 'neko', 'cf' ],
  run              : async (message, language) => {

    const data = await fetch('https://catfact.ninja/facts').then(res => res.json()).catch(err => err);
    if (data instanceof Error){
      const parameters = new language.Parameter({ '%ERROR%': data.message, '%AUTHOR%': message.author.tag });
      return message.reply(language.get({ '$in': 'ERRORS', id: data.name, parameters }));
    };
    if (!data || !data.data || !data.data.length){
      const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%SERVICE%': 'Catfact API' });
      return message.reply(language.get({ '$in': 'ERRORS', id: '503', parameters }));
    };
    return message.channel.send(
      new MessageEmbed().setColor(0xe620a4).setTitle(data.data[0].fact)
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'CATFACT_EFOOTER'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
   );
  }
};
