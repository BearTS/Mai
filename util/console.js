
function success(message, title = 'SUCCESS!'){
  return console.log('\x1b[32m', title, '\x1b[0m', message);
};

function warn(message, title = 'WARN!'){
  return console.log('\x1b[33m', title, '\x1b[0m', message);
};

function error(message, title = ''){
  return console.log(title ,'\x1b[31mERR!\x1b[0m', message);
};

module.exports = { success, warn, error }
