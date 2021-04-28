const { MessageEmbed , Permissions: { FLAGS }} = require('discord.js');
const moment = require('moment');

module.exports = {
  name             : 'warnings',
  description      : 'View warn records for a specific user.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [ FLAGS.MANAGE_GUILD ],
  group            : 'moderation',
  parameters       : [],
  examples         : [],
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : false,
  run              : async (message, language, [user]) => {
    const parameters = new language.Parameter({
      '%AUTHOR%': message.author.tag,
    });

    if (!user || !user.match(/\d{17,19}/)?.[0]){
      const response = language.get({ '$in': 'COMMANDS', id: '__ARGS_NOUSER', parameters });
      return message.channel.send(response);
    };

    const member = await message.guild.members.fetch(user.match(/\d{17,19}/)[0]).catch(()=>{});

    if (!member){
      const response = language.get({ '$in': 'COMMANDS', id: '__ARGS_NOUSER', parameters });
      return message.channel.send(response);
    };

    if (member.user.bot){
      const response = language.get({ '$in': 'COMMANDS', id: '__GLOB_WA_ISBOT', parameters });
      return message.channel.send(response);
    };

    if (member.user.profile === null){
      await member.user.loadProfile();
    };

    const embed = new MessageEmbed()
    .setDescription(member.warnings.map(x => `\`[${x.id}]\` - ${x.reason} - by <@!${x.executor}> (${moment(Number(x.id)).locale(message.author.profile.data.language || 'en').calendar()})`).join('\n') || language.get({ '$in':'COMMANDS', id: 'WARNINGS_NOWARN' }))
    .setAuthor(language.get({ '$in': 'COMMANDS', id: 'WARNINGS_LIST', parameters: parameters.assign({ '%USER%': member.user.tag }) }), null, member.user.displayAvatarURL({ format: 'png', dynamic: true })).setColor('ORANGE').addField('\u200b',language.get({'$in': 'COMMANDS', id: 'WARNINGS_TIME', parameters: { '%LOCALE%': `+${new Date().getTimezoneOffset()/-60}:00 UTC`}}))
    .setFooter(`Warning Records\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)

    return message.channel.send(embed);
  }
};
