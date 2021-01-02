const chatbot = require(`${process.cwd()}/util/chatbot`);
const experience = require(`${process.cwd()}/util/xp`);

module.exports = async (client, message) => {

  //*=================WELCOME TO THE  MESSAGE EVENT===============*/
  // This function everytime the bot receives a message payload from discord
  //*=============================================================*/

  // Ignore messages from botusers
  if (message.author.bot){
    return;
  };

  /*=============SHOW PREFIX WHEN USER TYPES PREFIX===============*/
  // When a user types prefix on Discord where this bot has permissions to view
  // channel and send message to, reply with the usable prefix for this bot.
  // comment out to disable~
  const serverprefix = client.guildProfiles.get(message.guild?.id)?.prefix || 'Not set'

  if (message.content.toLowerCase() === 'prefix'){
    return message.channel.send(`${message.author}, My prefix is \`${client.config.prefix}\`, The custom prefix is \`${serverprefix}\`.`)
  } else {
    // Do nothing..
  };
  /*==============================================================*/

  /*===================CHATBOT FUNCTIONALITY======================*/
  // When bot is mentioned or ?replied to, reply to user with a
  // human precise response possible using external api
  // if chatbot is used, use chatbot_successful as parameter
  // to disable xp gaining and command execution
  const { success: chatbot_successful } = chatbot(message);
  /*===========================================================*/


  /*=====================HANDLE COMMANDS=======================*/
  // Handle commands
  // Returns executed<Boolean> and reason<string|undefined>
  // True if the command has been executed
  // False if otherwise
  const { executed, reason } = client.commands.handle(message);
  /*============================================================*/

  /*=========================XP SYSTEM==========================*/
  // IF the command is executed, do not execute the xp system.
  // If the command did not execute but the termination of the
  //  command execution proves access to command, do not execute
  //  the xp system
  //
  // Returns xpAdded<Boolean> and reason<string|undefined>
  // True if the xp has been added
  // False if otherwise
  const execute = Boolean(!['PERMISSION', 'TERMINATED', 'COOLDOWN'].includes(reason));
  const response = await experience(message, executed, execute);

  // Log errors not caused by the following reasons
  if (!response.xpAdded && ![
    'DISABLED', // The xp is disabled, requires `EXPERIENCE_POINTS` on client#features
    'COMMAND_EXECUTED', // The command was executed successfully
    'COMMAND_TERMINATED', // The command was fetched but was terminated
    'DM_CHANNEL', // The message was sent on a dm
    'DISABLED_ON_GUILD', // The message was disabled on guild (xp inactive)
    'DISABLED_ON_CHANNEL', // The message was sent on a blacklisted channel
    'RECENTLY_TALKED', // The message author recently talked
  ].includes(response.reason)){
    message.client.logs.push(`XP error: ${response.reason} on ${message.guild.id}<${message.guild.id}> by ${message.author.tag}<${message.author.id}> at ${new Date()}`);
  };
  /*============================================================*/

  // add more functions on message event callback function...

  return;
};
