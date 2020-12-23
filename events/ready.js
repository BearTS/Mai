const consoleUtil = require(`${process.cwd()}/util/console`);

module.exports = async client => {

  consoleUtil.success(`${client.user.username} is now Online! (Loaded in ${client.bootTime} ms)\n\n`);

};
