module.exports = {
  name            : 'setlang',
  aliases         : [ 'setlanguage' ],
  group           : 'social',
  requiresDatabase: true,
  rankcommand     : false,
  description     : 'Sets your own language',
  parameters      : [ 'language code' ],
  examples        : [ 'setlang ja-jp' ],
  run             : async (message, language, [ code = '' ]) => {

    const AVAILABLELANGS = Object.keys(message.client.services.LANGUAGE.store);
    const parameters = new language.Parameter({
      '%AUTHOR%': message.author.tag,
      '%LANGUAGE_CODES%': message.client.services.UTIL.ARRAY.join(AVAILABLELANGS),
      '%LANGUAGE_CODE%': code
    });

    if (!AVAILABLELANGS.includes(code.toLowerCase())){
      return message.channel.send( language.get({ '$in': 'COMMANDS', id: 'SETLANG_CODEINV', parameters }));
    };

    if (code === message.author.profile?.data.language){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'SETLANG_IN_USE', parameters }));
    };

    const model = message.client.database['Profile'];
    let res = await model.findById(message.author.id);

    if (!res){
      res = await new model({ _id: message.author.id }).save();
    };

    res.data.language = code;

    return res.save()
    .then(() => {
      message.author.setLanguage(code);
      language = message.client.services.LANGUAGE.getCommand('setlang', code);
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'SETLANG_SUCCESS', parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
