const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'mai',
  description      : 'Mai is the best girl and there\'s no denying it!',
  aliases          : [ 'cmd', 'command' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'core',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [],
  examples         : [ 'mai', 'bestgirl' ],
  run              : async (message, language) => message.channel.send(

    new MessageEmbed()
    .setFooter(`${language.get({'$in': 'COMMANDS', id: 'MAI_EFOOTER'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`).setColor(0xe620a4)
    .setColor(0xe620a4)
    .setImage(message.client.images.mai())
  )
};
