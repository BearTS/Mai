module.exports = async (client, type, member) => {
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

  if (type === 'guild'){
    if (member.guild.profile === null){
      await member.guild.loadProfile();
    };
    const reward = member.guild.profile.xp.rewards.find(X => x.level === member.level);
    if (!reward) return;

    const role = member.guild.roles.cache.get(reward.id);
    if (!role) return;

    member.roles.add(role).catch(() => {});
  };
};
