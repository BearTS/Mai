const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  name             : 'anifacts',
  description      : 'Generate a random anime fact.',
  aliases          : [ "af", "animefact", 'anifact', 'animefacts' ],
  cooldown         : { time: 5e3 },
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'utility',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User Mention / ID' ],
  examples         : [ 'avatar', 'av @user', 'pfp 728394' ],
  run              : async (message, language, args) => {

    const response = await fetch('https://animu.ml/fact?tags=&minLength=&maxLength=', {
      headers: { "Auth": process.env.ANIMU_TOKEN, 'Content-Type': 'application/json' }
    }).then(response => response.json()).catch(err => err);

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%SERVICE%': 'animu.ml' });

    if (response instanceof Error){
      return message.reply(language.get({ '$in': 'ERRORS', id: response.name, parameters }));
    };

    if (response.statusCode){
      parameters.assign({ '%ERROR': response.statusMessage });
      return message.reply(language.get({ '$in': 'ERRORS', id: response.statusCode, parameters }));
    };

    const footer = language.get({ '$in': 'COMMANDS', id: 'ANIFACTS_EFOOTE' });

    return message.channel.send(
      new MessageEmbed()
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      .setThumbnail('https://thumbs.gfycat.com/ReliableSkeletalCanvasback-size_restricted.gif')
      .setTitle(language.get({ '$in': 'COMMANDS', id: 'ANIFACTS_TITLE' }))
      .setDescription(response.fact)
      .setColor('GREY')
    );
  }
};
