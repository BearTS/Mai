module.exports = async (message, executed, terminated) => {

  const id = message.author.id;

  // Do not add xp if the command was executed
  if (executed){
    return Promise.resolve({ id, xpAdded: false, reason: 'COMMAND_EXECUTED' });
  };

  // Do not add xp if the command was terminated
  if (terminated){
    return Promise.resolve({ id, xpAdded: false, reason: 'COMMAND_TERMINATED' });
  };

  // Do not add xp when messages are coming from DMs
  if (message.channel.type === 'dm'){
    return Promise.resolve({ id, xpAdded: false, reason: 'DM_CHANNEL'});
  };

  // Check if the client is has instantiated a database
  if (message.client.database === null){
    return Promise.resolve({ id, xpAdded: false, reason: 'DATABASE_NOT_FOUND' });
  };

  // Check if the database is connected
  if (!message.client.database.connected){
    return Promise.resolve({ id, xpAdded: false, reason: 'DATABASE_DISCONNECT' });
  };

  // Try to load the guild profile if it is unavailable to the client
  if (message.guild.profile === null){
    await message.guild.loadProfile();
  };

  const GUILDPROFILE = message.guild.profile;

  // Check if the server profile is available
  if (GUILDPROFILE === null){
    return Promise.resolve({ id, xpAdded: false, reason: 'PROFILE_NOT_FOUND' });
  };

  // Checl if the xp is enabled in the guild
  if (!GUILDPROFILE.xp.isActive){
    return Promise.resolve({ id, xpAdded: false, reason: 'DISABLED_ON_GUILD' });
  };

  // Check if the xp is disabled on the channel
  if (GUILDPROFILE.xp.exceptions.includes(message.channel.id)){
    return Promise.resolve({ id, xpAdded: false, reason: 'DISABLED_ON_CHANNEL' });
  };

  // Check if user has recently talked
  if (message.guild.xpcooldowns.has(message.author.id)){
    if (message.guild.xpcooldowns.get(message.author.id) + 6e4 > Date.now())
    return Promise.resolve({ id, xpAdded: false, reason: 'RECENTLY_TALKED' });
  };

  const addxp = await message.member.addxp().catch(e => e);
  const xpAdded = addxp === 'SUCCESS' ? true : false;
  const reason = addxp === 'SUCCESS' ? null : 'XPFUNC_ERROR';
  return Promise.resolve({ id, xpAdded, reason, msg: addxp || null });
};
