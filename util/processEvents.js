const consoleUtil = require(`${process.cwd()}/util/console`);

function unhandledRejection([ error, ...args], client){

  const channel = client.channels.cache.get(client.config.debug);
  const timezone = 9;
  const offset = 60000 * (new Date().getTimezoneOffset() - (-timezone * 60));
  const time = parseDate(new Date(Date.now() + offset).toLocaleString('ja-JP',{ timezone: 'Asia/Tokyo'}).split(/:|\s|\//));
  const stacklength = error.stack.split('\n').length;

  if (!channel){
    return console.log(error);
  } else {
    // do nothing
  };

  return channel.send(`\\🛠 ${error.name} caught!\n${time}\n\`\`\`xl\n${
    error.stack.split('\n').splice(0,5)
    .join('\n').split(process.cwd()).join('MAIN_PROCESS')
  }\n.....\n\`\`\``);
};

function uncaughtException([ error, ...args ], client){
  const channel = client.channels.cache.get(client.config.debug);
  const timezone = 9;
  const offset = 60000 * (new Date().getTimezoneOffset() - (-timezone * 60));
  const time = parseDate(new Date(Date.now() + offset).toLocaleString('ja-JP',{ timezone: 'Asia/Tokyo'}).split(/:|\s|\//));
  const stacklength = error.stack.split('\n').length;

  if (!channel){
    return console.log(error);
  } else {
    // do nothing
  };

  return channel.send(`\\🛠 ${error.name} caught!\n${time}\n\`\`\`xl\n${
    error.stack.split('\n').splice(0,5)
    .join('\n').split(process.cwd()).join('MAIN_PROCESS')
  }\n.....\n\`\`\``);
}

function parseDate([m, d, y, h, min, s, a]){
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const weeks = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return `${weeks[new Date( parseInt(y), m - 1, d ).getDay()]} ${months[m - 1]} ${d} ${parseInt(y)} ${h == 0 ? 12 : h > 12 ? h - 12 : h }:${min}:${s} ${a ? a : h < 12 ? 'AM' : 'PM'} JST`
};

const registers = { unhandledRejection, uncaughtException };

module.exports = function processEvents(event, args, client){
  if (registers[event]){
    return registers[event](args, client);
  } else {
    return consoleUtil.warn(`Function for process#event '${event}' not registered at /util/ProcessEvents.js`,'[BOT PROCESS]');
  };
};
