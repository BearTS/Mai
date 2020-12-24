const consoleUtil = require(`${process.cwd()}/util/console`);
const text = require(`${process.cwd()}/util/string`);

module.exports = async client => {

  consoleUtil.success(`${client.user.username} is now Online! (Loaded in ${client.bootTime} ms)\n\n`);

  const channel = client.channels.cache.get(client.config.channels.logs);
  channel?.send(`**REBOOT**: **${client.user.tag}** Just booted!\nServerCount = \`${text.commatize(client.guilds.cache.size)}\`, MemberCount = \`${text.commatize(client.guilds.cache.reduce((a,b) => a + b.memberCount, 0))}\`, Commands = \`${client.commands.size}\`, Boot Time = \`${client.bootTime}ms\``)
  .catch(() => {});
};
