module.exports = {
  name             : 'bet',
  description      : 'Rely on fate to increase your balance... or lower it.',
  aliases          : [ 'gamble' ],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'Amount' ],
  examples         : [ 'bet 100' ],
  run              : async (message, language, [amount = '']) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const profileDB  = message.client.database.Profile;
    const document   = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id });
    const { NUMBER } = message.client.services.UTIL;

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    amount = Number(amount.split('.')[0].replace(',',''));

    if (amount === NaN){                                   // BET_NAN => Not A Number
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BET_NAN', parameters }));
    };

    if (amount < 5e1 || amount > 5e5){                   // BET_OOB => Out of Bounds
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BET_OOB', parameters }));
    };

    if (amount > document.data.economy.bank){                   // BET_EEC => Not enough credits
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BET_NEC', parameters }));
    };

    document.data.economy.bank -= amount;
    await document.save();

    parameters.assign({ '%AMOUNT%': NUMBER.separate(amount) }); // BET_NOTIFY => Notify
    await message.reply(language.get({ '$in': 'COMMANDS', id: 'BET_NOTIFY', parameters }));

    await new Promise(resolve => setTimeout(() => resolve(0), 6e4));

    const won        = Math.floor(Math.random() * 3) === 2;
    const multiplier = Math.floor(Math.random() * 9) * 2;
    const prize      = amount + multiplier;

    if (!won){                                             // BET_LOST => Lost
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BET_LOST', parameters }));
    };

    document.data.economy.bank += amount + prize;

    parameters.assign({ '%WINNINGS%': NUMBER.separate(prize), '%MULTIPLIER%': multiplier });

    return document.save()
    .then(document => {
      message.author.profile = document;
      parameters.assign({ '%AMOUNT%': NUMBER.separate(amount) });
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'BEG_SUCCESS', parameters }));
    })
    .catch(error   => {
      parameters.assign({ '%ERROR%': error.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
