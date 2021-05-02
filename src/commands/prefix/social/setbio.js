module.exports = {
  name             : 'setbio',
  description      : 'Sets the profile bio for your profile card.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'bio' ],
  examples         : [ 'setbio The coolest person in town' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });

    if (!args.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SETBIO_NOARGS', parameters }));
    };

    if (args.join(' ').length > 200){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SETBIO_EXCEED', parameters }));
    };

    const document = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id });

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    document.data.profile.bio = args.join(' ');
    return document.save()
    .then(document => {
      message.author.profile = document;
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SETBIO_SUCCESS', parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
