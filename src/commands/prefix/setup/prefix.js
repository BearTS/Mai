const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'prefix',
  description      : 'Set/Disable the server\'s custom prefix.',
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
  parameters       : [ 'action type', 'prefix' ], // disable-default will only disable the 'm!' prefix, but not the 'mai' prefix
  examples         : [ 'prefix set ? ', 'prefix disable', 'prefix disable-default' ],
  run              : async (message, language, [actiontype = '', prefix = '']) => {

    actiontype = actiontype.toLowerCase();

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const database   = message.client.database.GuildProfile;
    const document   = message.guild.profile || await database.findById(message.guild.id) || new database({ _id: message.guild.id });

    if (!actiontype){
      const language = message.author.profile?.data.language;
      const path = ['SYSTEM', 'PREFIX'];
      const prop = {
        '%AUTHOR%'       : message.author.tag,
        '%CLIENTPREFIX%' : message.client.prefix,
        '%SERVERPREFIX%' : message.guild.profile?.prefix || 'Not set'
      };
      return message.reply(message.client.services.LANGUAGE.get({ parameters: prop, path, language }));
    };

    if (!message.member.permissions.has(FLAGS.MANAGE_GUILD)){
      const path       = [ 'SYSTEM', 'PERM_DISCOUSER' ];
      const language   = message.author.profile?.data.language || 'en-us';
      parameters.assign({ '%PERMISSIONS%': 'Manage Guild' });
      return message.reply(message.client.services.LANGUAGE.get({ path, language, parameters }));
    };

    if (!['set', 'disable', 'disable-default', 'enable-default'].includes(actiontype)){
      parameters.assign({ '%TYPE%': actiontype, '%TYPES%': 'set, disable, disable-default' });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'PREFIX_INVATYP', parameters }));
    };

    if (actiontype === 'set'){
      if (!prefix || prefix.length > 5){
        // When the user attempts to set the custom prefix to a length > than 5 or none.
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'PREFIX_SET_X', parameters }));
      };
      document.prefix = prefix;
    };

    if (actiontype === 'disable'){
      if (document.prefixdisabledefault === true){
        // When the default is disabled and a user tries to remove the custom prefix
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'PREFIX_DISBL_X', parameters }));
      };
      document.prefix = null;
    };

    if (actiontype === 'disable-default'){
      if (!document.prefix){
        // when there is no custom prefix and a user tries to disable the default
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'PREFIX_DBLDEF_X', parameters }));
      };
      if (document.prefixdisabledefault === true){
        // When the default is already disabled
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'PREFIX_DBLDEF_Y', parameters }));
      };
      document.prefixdisabledefault = true;
    };

    if (actiontype === 'enable-default'){
      if (document.prefixdisabledefault === false){
        // When the default is already enabled
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'PREFIX_EBLDEF_X', parameters }));
      };
      document.prefixdisabledefault = false;
    };

    document.save()
    .then(() => {
      message.guild.profile = document;
      parameters.assign({
        '%CUSTOMPREFIX%': prefix,
      })
      return message.reply(language.get({ '$in': 'COMMANDS', id: `PREFIX_S_${actiontype === 'set' ? 'SET' : actiontype === 'disable' ? 'DIS' : actiontype === 'disable-default' ? 'DFF' : 'EFF'}`, parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
