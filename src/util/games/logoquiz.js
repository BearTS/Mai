const { createCanvas, loadImage } = require('canvas');

const { join } = require('path');
const logos    = require(join(__dirname, '../../', '/assets/json/logoquiz.json' ));

module.exports = async (options) => {
  const meta =  logos[Math.floor(Math.random() * logos.length)];

  const canvas = createCanvas(396, 264);
  const ctx = canvas.getContext('2d');
  const logo = await loadImage(meta.url);

  const { message, title, args, document, language, parameters } = options;

  ctx.fillStyle = '#27292b';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 20;
  ctx.drawImage(await loadImage(meta.url), 0, 0, 396, 264);

   const files = [{ attachment: canvas.toBuffer(), name: 'logoquiz.png' }];
   const prompt = language.get({ '$in': 'COMMANDS', id: 'GAME_LOGOQUIZ_1', parameters });
   const clue = meta.name.replace(/\w/ig,'_').split('').join(' ');

   await message.channel.send(`${prompt}\n\`${clue}\``, { files });

   const filter = _message => message.author.id === _message.author.id;
   const opt = { max: 1, time: 30000, errors: ['time'] };
   const response = await message.channel.awaitMessages(filter, opt)
   .then(collected => {
     const content = collected.first().content.toLowerCase();
     if (content === meta.name.toLowerCase()){
       return { };
     } else {
       return { err: 'INCORRECT_ANS' };
     };
   })
   .catch(() => {
     hasNotEnded = false;
     return { err: 'TIMEOUT' };
  });

  const reason = {
    INCORRECT_ANS: language.get({ '$in': 'COMMANDS', id: 'GAME_LOGOQUIZ_2', parameters: parameters.assign({ '%NAME%': meta.name }) }),
    TIMEOUT      : language.get({ '$in': 'COMMANDS', id: 'GAME_LOGOQUIZ_3' }),
  };

  const win = !response.err, amount = win ? 500 : 250;

  document.data.economy.bank = Number(document.data.economy.bank) + amount;

  return document.save()
  .then(document => {
    message.author.profile = document;
    message.author.playing = false;
    parameters.assign({ '%AMOUNT%': message.client.services.UTIL.NUMBER.separate(amount), '%REASON%': reason[response.err] });
    return message.channel.send(language.get({ '$in': 'COMMANDS', id: `GAME_LOGOQUIZ_${win ? 4 : 5}`, parameters }));
  })
  .catch(error   => {
    parameters.assign({ '%ERROR%': error.message });
    return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
  });
};
