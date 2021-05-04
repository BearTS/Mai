const _ = require('lodash');
const { randomQuote } = require('animequotes');
const { createCanvas, registerFont } = require('canvas');

const { join } = require('path');
registerFont(join(__dirname, '../../assets/fonts/handwriting.ttf'), { family: 'Handwriting'});

module.exports = async (options) => {
  let quote;
  do { quote = randomQuote().quote } while (quote.split(/ +/).length > 30 || quote.split(/ +/).length < 200);

  const array       = quote.split(/ +/);
  const description = _.chunk(array, 6);
  const canvas      = createCanvas(300, description.length * 25 + 10);
  const ctx         = canvas.getContext('2d');

  const { message, title, args, document, language, parameters } = options;

  ctx.fillStyle = '#27292b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.font = '20px Handwriting';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';

  description.forEach((item, i) => {
    ctx.fillText(item.join(' '), canvas.width / 2, 25 * (i + 1), canvas.width - 10);
  });

  const files  = [{ attachment: canvas.toBuffer(), name: 'typingquiz.png' }];
  const prompt = language.get({ '$in': 'COMMANDS', id: 'GAME_TYPEQUIZ_1', parameters });

  await message.channel.send(prompt, { files });

  const filter = _message => message.author.id === _message.author.id;
  const opt = { max: 1, time: 45000, errors: ['time'] };
  const response = await message.channel.awaitMessages(filter, opt)
  .then(collected => {
    const content = collected.first().content.toLowerCase();
    if (content === quote.toLowerCase()){
      return { };
    } else {
      return { err: 'INCORRECT_CODE' };
    };
  })
  .catch(() => {
    hasNotEnded = false;
    return { err: 'TIMEOUT' };
  });

  const reason = {
    INCORRECT_CODE: language.get({ '$in': 'COMMANDS', id: 'GAME_TYPEQUIZ_2' }),
    TIMEOUT       : language.get({ '$in': 'COMMANDS', id: 'GAME_TYPEQUIZ_3' }),
  };

  const win = !response.err, amount = win ? 500 : 250;
  
  document.data.economy.bank = Number(document.data.economy.bank) + amount;

  return document.save()
  .then(document => {
    message.author.profile = document;
    message.author.playing = false;
    parameters.assign({ '%AMOUNT%': message.client.services.UTIL.NUMBER.separate(amount), '%REASON%': reason[response.err] });
    return message.channel.send(language.get({ '$in': 'COMMANDS', id: `GAME_TYPEQUIZ_${win ? 4 : 5}`, parameters }));
  })
  .catch(error   => {
    parameters.assign({ '%ERROR%': error.message });
    return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
  });
};
