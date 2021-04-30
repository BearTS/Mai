const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  name             : 'meme',
  description      : 'Generate a random meme from a select subreddit.',
  aliases          : [ 'humorme' ],
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
  examples         : [ 'meme', 'humorme' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const data = await fetch('https://meme-api.herokuapp.com/gimme').then(res => res.json()).catch(err => err);
    if (data instanceof Error){
      parameters.assign({ '%ERROR%': data.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: data.name, parameters }));
    };
    if (data.error){
      parameters.assign({ '%SERVICE%': 'Meme API' });
      return message.reply(language.get({ '$in': 'ERRORS', id: '429', parameters }));
    };
    parameters.assign({ '%CATEGORY%' : data.category });
    return message.channel.send(
      new MessageEmbed().setColor(0xe620a4).setImage(data.url).setAuthor(data.title, null, data.postLink)
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'MEME_EFOOTER'})}:${data.subreddit}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
   );
  }
};
