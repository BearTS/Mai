module.exports = (client, type, member) => {
  //*=================WELCOME TO THE GUILD MEMBER LEVEL UPDATE EVENT===============*/
  // This function is executed everytime a user's level is increased.
  // 'client' is the client that instantiated this event.
  // 'type' can either be 'global' for global level and 'guild' for guild levels.
  // 'member' is a guild member instance.
  //
  // You can add a message here that notifies a user when he/she levels up
  // EXAMPLE:
  //
  // ```
  // if (type === 'guild') message.channel.send(`Congratulations! You've been promoted to level ${member.level}!`);
  // ```
  //*=============================================================*/
  
  console.log({ type, member });
};
