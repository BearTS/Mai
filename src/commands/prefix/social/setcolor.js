module.exports = {
  name             : 'setcolor',
  description      : 'Sets the color for your profile card.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'hex code' ],
  examples         : [ 'setcolor #e567da' ],
  run              : async (message, language, [color]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });

    const hex = color?.match(/[0-9a-f]{6}|default/i)?.[0];

    if (!hex){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SETCOLOR_NOHEX', parameters }));
    };

    const document = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id });

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    document.data.profile.color = hex === 'default' ? null : String('#' + hex);

    return document.save()
    .then(document => {
      message.author.profile = document;
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SETCOLOR_SUCCESS', parameters: parameters.assign({ '%HEX%': hex }) }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
