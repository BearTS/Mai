const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

module.exports = {
  name             : 'respect',
  description      : 'Show thy respect. Accepts arguments.',
  aliases          : [  'f', 'rp', '+rp' ],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  group            : 'fun',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Something to rate with' ],
  examples         : [ 'respect', 'f Kyoto Animation', 'rp @user' ],
  run              : async (message, language, args) => {

    const argument      = message.cleanContent.split(/ +/).slice(1).join(' ')
    const parameters    = new language.Parameter({ '%AUTHOR%': message.member?.displayName || message.author.tag, '%ARGS%': argument });
    const desc_withargs = language.get({ '$in': 'COMMANDS', id: 'RESPECT_DESCA'  , parameters });
    const desc_woutargs = language.get({ '$in': 'COMMANDS', id: 'RESPECT_DESCB'  , parameters });
    const footer        = language.get({ '$in': 'COMMANDS', id: 'RESPECT_EFOOTER', parameters });

    const rep = await message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setDescription(args.length ? desc_withargs : desc_woutargs)
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
    );

    await message.delete().catch(() => null);

    return rep.react("🇫")

  }
};
