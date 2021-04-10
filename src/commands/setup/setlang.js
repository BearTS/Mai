const { readdirSync } = require('fs');
const { join } = require('path');
const AVAILABLELANGS = readdirSync(join(__dirname, '../..', 'assets/language')).map(x => x.split('.json')[0]);

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
  run: async (message, language, [code = ''] ) => {

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

    res.data.language = code;
    message.author.setLanguage(code);

    language = message.client.services.LANGUAGE.getCommand('setlang', code);

    return res.save()
    .then(() => {
      const parameters = { '%AUTHOR%': message.author.tag, '%LANGUAGE_CODE%': code };
      const already_in_use = language.get({ id: 'SUCCESS', parameters });
      return message.channel.send(already_in_use);
    })
    .catch(console.error);
  }
};
