module.exports = {
  name             : 'unequip',
  description      : 'Unequip a certain item.',
  aliases          : [],
  cooldown         : { time: 3e3 },
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'item type' ],
  examples         : [ 'unequip wreath', 'unequip background' ],
  run              : async (message, language, [type = '']) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    if (!type.match(/wreath|background|hat|pattern|emblem/)){
      parameters.assign({ '%TYPES%': 'Background, Hat, Emblem, Pattern, Wreath' })
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'UNEQUIP_NOTYPE', parameters }));
    };
    const document = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id });
    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    document.data.profile[type.toLowerCase()] = null;

    return document.save()
    .then(document => {
      message.author.profile = document;
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'UNEQUIP_SUCCESS', parameters: parameters.assign({ '%TYPE%': type }) }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });

  }
};
