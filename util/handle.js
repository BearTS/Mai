const { duration } = require('moment');

function CommandHandler(manager, message){

  if (message.guild){
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
      return { executed: false, reason: 'PERMISSION_SEND'};
    } else {
      // Do nothing..
    };
  };

  const serverprefix = message.client.guildProfiles.get(message.guild?.id)?.prefix || null;
  let prefix;

  if (message.content.startsWith('mai')){
    prefix = 'mai'
  } else if (message.content.startsWith(message.client.prefix)){
    prefix = message.client.prefix;
  } else if (serverprefix && message.content.startsWith(serverprefix)){
    prefix = serverprefix;
  };

  if (!prefix){
    return { executed: false, reason: 'PREFIX'};
  };

  const [ name, ...args ] = message.content.slice(prefix.length)
  .split(/ +/)
  .filter(Boolean);

  const command = manager.get(name);

  if (!command || !command.validate()){
    return { executed: false, reason: 'NOT_FOUND' };
  };

  const { accept: permission_granted, terminate, embed } = command.testPermissions(message);

  if (terminate){
    return { executed: false, reason: 'TERMINATED' };
  };

  if (!permission_granted){
    if (!!message.guild){
      message.channel.send(
        message.channel.permissionsFor(message.guild.me).has('EMBED_LINKS')
        ? embed : embed.description
      );
    } else {
      message.channel.send(embed);
    };
    return { executed: false, reason: 'PERMISSION' };
  };

  const { accept: cooldown_accepted, timeLeft } = command.testCooldown(message, command);

  if (!cooldown_accepted){
     message.channel.send([
      `<:cancel:767062250279927818>\u2000\u2000|\u2000\u2000${message.author}`,
      `${command.cooldown.message}\n⏳\u2000\u2000|\u2000\u2000Time left:`,
      duration(timeLeft, 'milliseconds').format('H [hours, ] m [minutes, and] s [seconds]')
    ].join(' '))

    return { executed: false, reason: 'COOLDOWN' };
  } else {
    command.run(message.client, message, args);
  };

  return { executed: true };
};

module.exports = CommandHandler;
