const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'kick',
  description      : 'Kicks mentioned user from this server.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [ FLAGS.KICK_MEMBERS ],
  permissions      : [ FLAGS.KICK_MEMBERS ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User Mention | ID', 'Kick Reason' ],
  examples         : [ 'kick @user breaking server rules', 'kick @user', 'kick 7827342137832612783' ],
  run              : async (message, language, [user = '', ...reason]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix, '%GUILD%': message.guild.name });
    const force      = Boolean(reason.join(' ').match(/-f/i));
    let   proceed    = force ? true : false;
          reason     = reason.join(' ').replace(/(-f|-d)*/ig,'') || 'Unspecified';
          member     = member.match(/\d{17,19}/)?.[0] || null;

    if (!member || !(member = await message.guild.members.fetch(member).catch(() => {}))){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'KICK_NO_USER'    , parameters }));
    };

    if (member.id === message.author.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'KICK_IS_SELF'    , parameters }));
    };

    if (member.id === message.client.user.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'KICK_IS_ME'      , parameters }));
    };

    if (member.id === message.guild.owner.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'KICK_IS_SV_OWNE', parameters }));
    };

    if (message.client.owners.includes(member.id)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'KICK_IS_MAIDEV'  , parameters }));
    };

    if (message.member.roles.highest.position < member.roles.highest.position){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'KICK_IS_HIGHROL', parameters }));
    };

    if (!member.kickable){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'KICK_FILTR_FINA', parameters }));
    };

    parameters.assign({ '%MEMBER%': member.user.tag, '%REASON%': reason });

    if (!force){
      parameters.assign({ '%TIP%': language.get({ '$in': 'COMMANDS', id: 'KICK_ISNOTFORCE', parameters })})
      proceed = await message.channel.send(language.get({ '$in': 'COMMANDS', id: 'KICK_ASKCONFIRM', parameters })).then(() => {
        const choices = ['y', 'yes', 'n', 'no'];
        const filter  = _message => message.author.id === _message.author.id && choices.includes(_message.content.toLowerCase());
        const options = { max: 1, time: 30000, errors: ['time'] };
        return message.channel.awaitMessages(filter, options)
        .then((c) => ['y','yes'].includes(c.first().content.toLowerCase()) ? true : false)
        .catch(() => false);
      });
    };

    if (!proceed){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'KICK_IS_CANCELL', parameters }));
    };

    const langcode = member.user.profile?.data.language || 'en-us';
    const memlang  = message.client.services.LANGUAGE.getCommand('ban', langcode);
    await member.send(memlang.get({ '$in': 'COMMANDS', id: 'KICK_SENDTOMEM', parameters }));

    return member.kick({ reason: `MAI Kick Command: ${message.author.tag}: ${reason}` })
    .then(()    => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'KICK_SUCCESS', parameters })))
    .catch(err  => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'KICK_FAILED',  parameters: parameters.assign({ '%ERROR%': err.message }) })))
    .finally(() => !message.deleted ? message.delete() : null);

  }
};
