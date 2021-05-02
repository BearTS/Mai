const { createCanvas, registerFont } = require('canvas');
const _ = require('lodash');

const { join } = require('path');
registerFont(join(__dirname, '../../assets/fonts/captcha.ttf'), { family: 'Captcha'});

module.exports = async (options) => {

  const char = String.fromCharCode(...Array(123).keys()).replace(/[\W1]/g,'');
  const code = (length) => _.sampleSize(char, length).join('');

  let length       = 5;
  let hasNotEnded  = true;
  let basecredits  = 200;
  let captchacount = 0;

  const { message, title, args, document, language, parameters } = options;

  await message.channel.send(language.get({ '$in': 'COMMANDS', id: 'GAME_CAPTCHA_1' }));
  await new Promise(resolve => setTimeout(() => { resolve()}, 5000));

  const execute = async () => {

    const canvas   = createCanvas(150,50);
    const ctx      = canvas.getContext('2d');
    const codetext = code(length);

    ctx.fillStyle = '#27292b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = 'center';
    ctx.font      = 'bold 20px Captcha';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(codetext, 75, 35, 140);

    const files  = [{ attachment: canvas.toBuffer(), name: 'captcha.png' }];
    const prompt = language.get({ '$in': 'COMMANDS', id: 'GAME_CAPTCHA_2', parameters });

    await message.channel.send(prompt, { files });

    const filter = _message => message.author.id === _message.author.id;
    const options = { max: 1, time: 15000, errors: ['time'] };
    const response = await message.channel.awaitMessages(filter, options)
    .then(collected => {
      const content = collected.first().content;
      if (content === codetext){
        captchacount++;
        basecredits += 100;
        return {};
      } else {
        hasNotEnded = false;
        return { err: 'INCORRECT_CODE' };
      };
    })
    .catch(() => {
      hasNotEnded = false;
      return { err: 'TIMEOUT' };
    });

    if (response.err){
      const reason = {
        INCORRECT_CODE: language.get({ '$in': 'COMMANDS', id: 'GAME_CAPTCHA_3' }),
        TIMEOUT       : language.get({ '$in': 'COMMANDS', id: 'GAME_CAPTCHA_4' })
      };
      return message.channel.send(`\\❌ **${message.author.tag}**, ${reason[response.err]}`);
    };

    await message.channel.send(language.get({ '$in': 'COMMANDS', id: 'GAME_CAPTCHA_5', parameters }));
    length++;

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
    parameters.assign({ '%AMOUNT%': message.client.services.UTIL.NUMBER.separate(basecredits), '%CAPTCHACOUNT%': captchacount });
    return message.channel.send(language.get({ '$in': 'COMMANDS', id: `GAME_CAPTCHA_${basecredits > 200 ? 6 : 7}`, parameters }));
  })
  .catch(error   => {
    parameters.assign({ '%ERROR%': error.message });
    return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
  });
}
