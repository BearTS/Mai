const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'avatar',
  description      : 'Shows avatar of the provided user, or yourself.',
  aliases          : [ 'av', 'pfp', 'displayprofile' ],
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
  parameters       : [ 'User Mention / ID' ],
  examples         : [ 'avatar', 'av @user', 'pfp 728394' ],
  run              : async (message, language, [ user = '' ]) => {

    const id     = user.match(/\d{17,19}/)?.[0] || message.author.id;
    const member = await message.guild?.members.fetch(id).catch(() => {}) || message?.member;
    let   color  = member?.displayColor || 'GREY';
          user   = member?.user || message.author
    const avatar = user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' });

    const parameters = new language.Parameter({
      '%USER%'  : user.tag,
      '%AVATAR%': avatar
    });

    const footer = language.get({ '$in': 'COMMANDS', id: 'AVATAR_EFOOTER', parameters });
    const desc   = language.get({ '$in': 'COMMANDS', id: 'AVATAR_EDESCRP', parameters });

    return message.channel.send(
      new MessageEmbed()
      .setColor(color)
      .setImage(avatar)
      .setDescription(desc)
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
    );
  }
};
