const { join } = require('path');
const chatbot = require(join(__dirname, '..', 'util/chatbot'));
const xp = require(join(__dirname, '..', 'util/xp'));

module.exports = async (client, message) => {
  //*=================WELCOME TO THE  MESSAGE EVENT===============*/
  // This function everytime the bot receives a message payload from discord
  //*=============================================================*/

  /*==========================IGNORE BOTS=========================*/
  // When the received message payload is authored by a bot, cease the parsing
  // immediately.
  if (message.author.bot){
    return;
  };
  /*==============================================================*/


  /*==========================CHECK PROFILE=======================*/
  // Every message, check if the author of the message has loaded their profile.
  // If not, load it from the database. Always check if the profile is available
  // when using it on command files to prevent type errors.
  if (message.author.profile === null){
    await message.author.loadProfile();
  };
  /*==============================================================*/

  /*==========================CHECK PROFILE=======================*/
  // Every message, check if the guild of the message has loaded its profile.
  // If not, load it from the database. Always check if the profile is available
  // when using it on command files to prevent type errors.
  if (message.guild && message.guild.profile === null){
    await message.guild.loadProfile();
  };
  /*==============================================================*/

  /*=============SHOW PREFIX WHEN USER TYPES PREFIX===============*/
  // When a user types prefix on Discord where this bot has permissions to view
  // channel and send message to, reply with the usable prefix for this bot.
  // comment out the following code-block to disable~
  if (message.content.toLowerCase() === 'prefix'){
    const language = message.author.profile?.data.language;
    const path = ['SYSTEM', 'PREFIX'];
    const prop = {
      '%AUTHOR%': message.author.tag,
      '%CLIENTPREFIX%' : client.prefix,
      '%SERVERPREFIX%': message.guild.profile?.prefix || 'Not set'
    };
    const response = message.client.services.LANGUAGE
    .get({ parameters: prop, path, language });

    return message.reply(response);
  };
  /*==============================================================*/



  /*===================CHATBOT FUNCTIONALITY======================*/
  // When bot is mentioned or ?replied to, reply to user with a
  // human precise response possible using external api
  // if chatbot is used, use success as parameter
  // to disable xp gaining and command execution.
  // Triggers only when chatbot_id and chatbot_key are provided on env file
  if ('chatbot_id' in process.env && 'chatbot_key' in process.env){
    const { success } = await chatbot(message);
  };
  /*=============================================================*/



  /*=====================HANDLE COMMANDS=======================*/
  // Handle commands
  // Returns executed<Boolean> and reason<string|undefined>
  // True if the command has been executed
  // False if otherwise
  const { executed, reason } = await client.commands.handle(message);
  /*===========================================================*/

  /*=========================XP SYSTEM==========================*/
  // IF the command is executed, do not execute the xp system.
  // If the command did not execute but the termination of the
  //  command execution proves access to command, do not execute
  //  the xp system
  // Returns xpAdded<Boolean> and reason<string|undefined>
  // True if the xp has been added
  // False if otherwise
  const terminated = Boolean(['PERMISSION', 'TERMINATED', 'COOLDOWN'].includes(reason));
  const { xpAdded, reason: xpReason, msg } = await xp(message, executed, terminated);

  // console.log({ xpAdded, xpReason, msg });

  /* Possible XP REASONS when xpAdded is false
  'COMMAND_EXECUTED' => The command was executed successfully
  'COMMAND_TERMINATED' => The command was fetched but was terminated
  'DM_CHANNEL' => The message was sent on a dm
  'DATABASE_NOT_FOUND' => Database was disabled
  'DATABASE_DISCONNECT' => The Database is not connected
  'DISABLED_ON_GUILD' => The message was disabled on guild (xp inactive)
  'DISABLED_ON_CHANNEL' => The message was sent on a blacklisted channel
  'PROFILE_NOT_FOUND' => The guild profile could not be loaded
  'RECENTLY_TALKED' => The message author recently talked
  'XPFUNC_ERROR' => An Error occured while processing the xp, check the 'msg' var
   */

};
