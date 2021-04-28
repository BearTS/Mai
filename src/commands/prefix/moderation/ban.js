const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'ban',
  description      : 'Bans mentioned user from this server.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [ FLAGS.BAN_MEMBERS ],
  permissions      : [ FLAGS.BAN_MEMBERS ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User Mention | ID', 'Ban Reason' ],
  examples         : [ 'ban @user breaking server rules', 'ban @user', 'ban 7827342137832612783' ],
  run              : async (message, language, [member = '', ...reason]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix, '%GUILD%': message.guild.name });
    const force      = Boolean(reason.join(' ').match(/-f/i));
    const deletemsgs = Boolean(reason.join(' ').match(/-d/i));
    let   proceed    = force ? true : false;
          reason     = reason.join(' ').replace(/(-f|-d)*/ig,'') || 'Unspecified';
          member     = member.match(/\d{17,19}/)?.[0] || null;

    if (!member || !(member = await message.guild.members.fetch(member).catch(() => {}))){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_NO_USER'    , parameters }));
    };

    if (member.id === message.author.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_IS_SELF'    , parameters }));
    };

    if (member.id === message.client.user.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_IS_ME'      , parameters }));
    };

    if (member.id === message.guild.owner.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_IS_SV_OWNER', parameters }));
    };

    if (message.client.owners.includes(member.id)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_IS_MAIDEV'  , parameters }));
    };

    if (message.member.roles.highest.position < member.roles.highest.position){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_IS_HIGHROLE', parameters }));
    };

    if (!member.bannable){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_FILTR_FINAL', parameters }));
    };

    parameters.assign({ '%MEMBER%': member.user.tag, '%REASON%': reason });

    if (!force){
      parameters.assign({ '%TIP%': language.get({ '$in': 'COMMANDS', id: 'BAN_ISNOTFORCED', parameters })})
      proceed = await message.channel.send(language.get({ '$in': 'COMMANDS', id: 'BAN_ASKCONFIRM', parameters })).then(() => {
        const choices = ['y', 'yes', 'n', 'no'];
        const filter  = _message => message.author.id === _message.author.id && choices.includes(_message.content.toLowerCase());
        const options = { max: 1, time: 30000, errors: ['time'] };
        return message.channel.awaitMessages(filter, options)
        .then((c) => ['y','yes'].includes(c.first().content.toLowerCase()) ? true : false)
        .catch(() => false);
      });
    };

    if (!proceed){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_IS_CANCELLD', parameters }));
    };

    const langcode = member.user.profile?.data.language || 'en-us';
    const memlang  = message.client.services.LANGUAGE.getCommand('ban', langcode);
    await member.send(memlang.get({ '$in': 'COMMANDS', id: 'BAN_SENDTOMEM', parameters }));

    return member.ban({ reason: `MAI Ban Command: ${message.author.tag}: ${reason}`, days: deletemsgs ? 7 : 0 })
    .then(()    => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'BAN_SUCCESS', parameters })))
    .catch(err  => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'BAN_FAILED',  parameters: parameters.assign({ '%ERROR%': err.message }) })))
    .finally(() => !message.deleted ? message.delete() : null);
  }
};
