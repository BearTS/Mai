const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'suggest',
  description      : 'Suggest something for the server. If you have suggestion for the bot instead please use the feedback command or join our support server!',
  aliases          : [ 'cmd', 'command' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.ADD_REACTIONS ],
  permissions      : [],
  group            : 'core',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Suggestion Message' ],
  examples         : [ 'suggest please remove some of the inactive members...' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const channel    = message.guild.channels.cache.get(message.guild.profile?.channels.suggest);
    const perms      = [ FLAGS.VIEW_CHANNEL, FLAGS.SEND_MESSAGES, FLAGS.EMBED_LINKS ];

    if (!args.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SUGGEST_NOARGS', parameters }));
    };

    if (!channel){
      parameters.assign({ '%CHANNEL%': channel.toString() });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SUGGEST_NOCHAN', parameters }));
    };

    if (!channel.permissionsFor(message.guild.me)?.has(perms)){
      parameters.assign({ '%CHANNEL%': channel.toString() });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SUGGEST_NOPERM', parameters }));
    };

    const embed = new MessageEmbed().setTitle(`${message.author.tag}'s Suggestion`).setColor('YELLOW').setDescription(args.join(' '))
    .setFooter(`Suggestion\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
    .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true })).addField('Status', 'Under Review', true);

    return channel.send(embed).then(async suggestion => {
      await message.react('✅').catch(() => {});
      await suggestion.react('⬆️').catch(() => {});
      await suggestion.react('⬇️').catch(() => {});
    });
  }
};
