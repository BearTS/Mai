const { Permissions: { FLAGS } } = require('discord.js');

module.exports = {
  name             : 'muterole',
  description      : 'Set/Disable the server\'s mute role.',
  aliases          : [ ],
  cooldown         : { time: 1e3 },
  clientPermissions: [],
  permissions      : [],
  group            : 'setup',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : false,
  parameters       : [ 'action type', 'ID' ],
  examples         : [ 'muterole set <role ID>', 'muterole disable' ],
  run              : async (message, language, [actiontype = '', id = '']) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const database   = message.client.database.GuildProfile;
    const document   = message.guild.profile || await database.findById(message.guild.id) || new database({ _id: message.guild.id });
    let role, hasPerms;

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    if (!actiontype){
      if (!document.roles.muted){
        // IF there is no roles set for the muted role
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTEROLE_NOMUTE', parameters }));
      };
      if (!message.guild.roles.cache.has(document.roles.muted)){
        // If this guild has deleted/removed the muted role previously set
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTEROLE_INVMTE', parameters }));
        //
      };
      parameters.assign({ '%ROLE%': message.guild.roles.cache.get(document.roles.muted).toString()});
      if (message.guild.me.roles.highest.position <= message.guild.roles.cache.get(document.roles.muted).position){
        // If the role is present but bot has no permission to add / remove it to any user
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTEROLE_XPERMS', parameters }));
      };
      // Send the current mute role.
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTEROLE_SENDCR', parameters }));
    };

    if (!message.member.permissions.has(FLAGS.MANAGE_ROLES)){
      const path       = [ 'SYSTEM', 'PERM_DISCOUSER' ];
      const language   = message.author.profile?.data.language || 'en-us';
      parameters.assign({ '%PERMISSIONS%': 'Manage Roles' });
      return message.reply(message.client.services.LANGUAGE.get({ path, language, parameters }));
    };

    if (!['set', 'disable'].includes(actiontype.toLowerCase())){
      // If the first parameter is neither set nor disable
      parameters.assign({ '%TYPE%': actiontype, '%TYPES%': 'set, disable' });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTEROLE_INVTYP', parameters }));
    };

    if (actiontype === 'set'){
      role = id.match(/\d{17,19}/)?.[0];
      // If there is no role provided or the role is not in the server
      if (!role || !(role = message.guild.roles.cache.get(role))){
        return message.reply(language.get({'$in': 'COMMANDS', id: 'MUTEROLE_INV_ID', parameters }));
      };
      document.roles.muted = role.id
      hasPerms = message.guild.me.roles.highest.position > role.position;
    };

    if (actiontype === 'disable'){
      document.roles.muted = null;
    };

    document.save()
    .then(() => {
      message.guild.profile = document;
      const disabled = document.roles.muted === null;
      parameters.assign({ '%ROLE%': role?.toString(), '%ADD%': hasPerms ? '' : '\n' + language.get({ '$in': 'COMMANDS', id: 'MUTEROLE_S_NPRM' })});
      return message.reply(language.get({ '$in': 'COMMANDS', id: `MUTEROLE_S_${disabled ? 'DABL' : 'EABL'}`, parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
