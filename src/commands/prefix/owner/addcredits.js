module.exports = {
  name            : 'addcredits',
  aliases         : [],
  ownerOnly       : true,
  group           : 'owner',
  requiresDatabase: true,
  rankcommand     : false,
  description     : 'Add credits to users! Append negative sign to remove credits from users!',
  parameters      : [ 'User Mention', 'Amount' ],
  examples        : [ 'addcredits @user 1000'  ],
  run             : async (message, language, [user = '', amount]) => {

    const parameters = new language.Parameter({ '%AUTHOR%' : message.author.tag });
          user       = await message.client.users.fetch(user.match(/\d{17,19}/)?.[0]).catch(() => {});
    if (!user){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDCREDITS_USER', parameters }));
    };
    if (user.bot){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDCREDITS_BOT', parameters }));
    };
    if (!Number(amount)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDCREDITS_AMT', parameters }));
    };
    const document = await message.client.database.Profile.findById(user.id);
    if (document instanceof Error){
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters: parameters.assign({ '%ERROR%': err.message })}));
    };
    if (document === null){
      document = new message.client.database.Profile({ _id: user.id });
    };
    document.data.economy.bank = Number(document.data.economy.bank) + Number(amount);
    parameters.assign({ '%AMOUNT%': message.client.services.UTIL.NUMBER.separate(amount), '%USER%': user.tag });
    return document.save()
    .then(document => {
      user.profile = document;
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDCREDITS_SCCS', parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
