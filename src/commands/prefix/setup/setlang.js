module.exports = {
  name: 'setlang',
  aliases: [ 'setlanguage' ],
  group: 'setup',
  requiresDatabase: true,
  rankcommand: false,
  description: 'Sets your own language',
  parameters: [ 'language code' ],
  examples: [
    'setlang ja-jp'
  ],
  run: async (message, language, [ code = '' ]) => {
    const AVAILABLELANGS = Object.keys(message.client.services.LANGUAGE.store);

    if (!AVAILABLELANGS.includes(code.toLowerCase())){
      const parameters = { '%AUTHOR%': message.author.tag, '%LANGUAGE_CODES%': message.client.services.UTIL.ARRAY.join(AVAILABLELANGS)};
      const invalid_code = language.get({ id: 'INVALID_CODE', parameters });
      return message.channel.send(invalid_code);
    };

    if (code === message.author.profile?.data.language){
      const parameters = { '%AUTHOR%': message.author.tag, '%LANGUAGE_CODE%': code };
      const already_in_use = language.get({ id: 'ALREADY_IN_USE', parameters });
      return message.channel.send(already_in_use);
    };

    const model = message.client.database['Profile'];
    let res = await model.findById(message.author.id);

    if (!res){
      res = await new model({ _id: message.author.id }).save();
    };


    return res.save()
    .then(() => {
      res.data.language = code;
      message.author.setLanguage(code);
      language = message.client.services.LANGUAGE.getCommand('setlang', code);
      const parameters = { '%AUTHOR%': message.author.tag, '%LANGUAGE_CODE%': code };
      const already_in_use = language.get({ id: 'SUCCESS', parameters });
      return message.channel.send(already_in_use);
    })
    .catch(() => {
      const parameters = { '%AUTHOR%': message.author.tag, '%ERROR_NAME%': err.message };
      return message.channel.send(language.get({ id: 'FAIL_ON_SAVE', parameters }));
    });
  }
};
