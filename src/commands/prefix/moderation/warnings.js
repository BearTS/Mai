const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'warnings',
  description: 'View warn records for a specific user.',
  aliases: [],
  cooldown: null,
  clientPermissions: [ ],
  permissions: [ 'MANAGE_GUILD' ],
  group: 'setup',
  parameters: [ ],
  examples: [ ],
  guildOnly: true,
  ownerOnly: false,
  adminOnly: false,
  nsfw: false,
  requiresDatabase: true,
  rankcommand: false,
  run: async (message, language, [user]) => {
    if (!user || !user.match(/\d{17,19}/)?.[0]){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'NO_USER', parameters }));
    };

    const member = await message.guild.members.fetch(user.match(/\d{17,19}/)[0]).catch(()=>{});

    if (!member){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'NO_USER', parameters }));
    };

    if (member.user.bot){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'BOT_USER', parameters }));
    };

    if (member.user.profile === null){
      await member.user.loadProfile();
    };

    const embed = new MessageEmbed()
    .setDescription(member.warnings.map(x => `\`[${x.id}]\` - ${x.reason} - by <@!${x.executor}> (${moment(Number(x.id)).locale(message.author.profile.data.language || 'en').calendar()})`).join('\n') || language.get({ id: 'NO_WARNINGS' }))
    .setAuthor(language.get({ id: 'WARN_LIST', parameters: { '%USER%': member.user.tag }}), null, member.user.displayAvatarURL({ format: 'png', dynamic: true })).setColor('ORANGE').addField('\u200b',language.get({id: 'TIME', parameters: { '%LOCALE%': `+${new Date().getTimezoneOffset()/-60}:00 UTC`}}))
    .setFooter(`Warning Records\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)

    return message.channel.send(embed);
  }
};
