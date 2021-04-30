const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  name             : 'advice',
  description      : 'Generate a random useless advice.',
  aliases          : [ 'tips', 'advise' ],
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
  examples         : [ 'advice', 'tips', 'advise' ],
  run              : async (message, language) => {

    const data = await fetch('https://api.adviceslip.com/advice').then(res => res.json()).catch(err => err);
    if (data instanceof Error){
      const parameters = new language.Parameter({ '%ERROR%': data.message, '%AUTHOR%': message.author.tag });
      return message.reply(language.get({ '$in': 'ERRORS', id: data.name, parameters }));
    };
    if (!data.slip || !data.slip.id){
      const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%SERVICE%': 'Advice API' });
      return message.reply(language.get({ '$in': 'ERRORS', id: '503', parameters }));
    };
    return message.channel.send(
      new MessageEmbed().setColor(0xe620a4).setTitle(data.slip.advice)
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'ADVICE_EFOOTER'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
   );
  }
};
