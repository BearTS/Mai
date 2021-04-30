const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  name             : 'joke',
  description      : 'Generate a random joke from a joke API!',
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
  parameters       : [],
  examples         : [],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const data = await fetch('https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist').then(res => res.json()).catch(err => err);
    if (data instanceof Error){
      parameters.assign({ '%ERROR%': data.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: data.name, parameters }));
    };
    if (data.error){
      parameters.assign({ '%SERVICE%': 'Joke API' });
      return message.reply(language.get({ '$in': 'ERRORS', id: '429', parameters }));
    };
    parameters.assign({ '%CATEGORY%' : data.category });
    const title = language.get({ '$in': 'COMMANDS', id: 'JOKE_EMBEDTITLE', parameters });
    return message.channel.send(
      new MessageEmbed().setColor(0xe620a4).setTitle(title).setThumbnail('https://i.imgur.com/KOZUjcc.gif').setDescription(data.type === 'twopart' ? `${data.setup}\n\n||${data.delivery}||` : data.joke)
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'JOKE_EFOOTER'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
   );
  }
};
