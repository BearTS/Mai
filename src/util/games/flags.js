const { join } = require('path');
const flags    = Object.entries(require(join(__dirname, '../../', '/assets/json/flags.json' )));

module.exports = async (options) => {
  let hasNotEnded = true, attempts = 0, basecredits = 200;

  const { message, title, args, document, language, parameters } = options;

  await message.channel.send(language.get({ '$in': 'COMMANDS', id: 'GAME_FLAGS_1' }));
  await new Promise(resolve => setTimeout(() => { resolve()}, 5000));

  const execute = async () => {
    let [code, country] = flags[Math.floor(Math.random() * flags.length)];
                country = country.split(',')[0];

    const attachment = `https://raw.githubusercontent.com/maisans-maid/country-flags/master/png250px/${code.toLowerCase()}.png`
    const files = [ { attachment, name: 'flags.png' }];
    const prompt = language.get({ '$in': 'COMMANDS', id: 'GAME_FLAGS_2', parameters });

    await message.channel.send(prompt, { files });

    const filter = _message => message.author.id === _message.author.id;
    const options = { max: 1, time: 30000, errors: ['time'] };
    const response = await message.channel.awaitMessages(filter, options)
   .then(collected => {
     const content = collected.first().content;
     if (content.toLowerCase() === country.toLowerCase()){
       attempts++;
       basecredits += 100;
       return {};
     } else {
       hasNotEnded = false;
       return { err: 'INCORRECT_ANS' };
     };
   })
   .catch(() => {
     hasNotEnded = false;
     return { err: 'TIMEOUT' };
   });

   if (response.err){
     const reason = {
       INCORRECT_ANS: language.get({ '$in': 'COMMANDS', id: 'GAME_FLAGS_3', parameters: parameters.assign({ '%COUNTRY%': country }) }),
       TIMEOUT      : language.get({ '$in': 'COMMANDS', id: 'GAME_FLAGS_4', parameters: parameters.assign({ '%COUNTRY%': country }) }),
     };
     return message.channel.send(`\\❌ **${message.author.tag}**, ${reason[response.err]}`);
   };

   await message.channel.send(language.get({ '$in': 'COMMANDS', id: 'GAME_FLAGS_5', parameters }));

   return Promise.resolve();
  };

  do {
    await execute();
  } while (hasNotEnded);

  document.data.economy.bank += basecredits;

  return document.save()
  .then(document => {
    message.author.profile = document;
    message.author.playing = false;
    parameters.assign({ '%AMOUNT%': message.client.services.UTIL.NUMBER.separate(basecredits), '%FLAGCOUNT%': attempts });
    return message.channel.send(language.get({ '$in': 'COMMANDS', id: `GAME_FLAGS_${basecredits > 200 ? 6 : 7}`, parameters }));
  })
  .catch(error   => {
    parameters.assign({ '%ERROR%': error.message });
    return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
  });
};
