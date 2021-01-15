module.exports = {
  name: 'addroles',
  aliases: [ 'addrole' ],
  guildOnly: true,
  permissions: [ 'MANAGE_ROLES' ],
  clientPermissions: [ 'MANAGE_ROLES' ],
  group: 'moderation',
  description: 'Adds the mentioned roles and/or supplied role IDs to the mentioned user',
  examples: [
    'addroles @user @role1 @role2 @role3',
    'addrole @user @role'
  ],
  run: async (client, message, [member = '', ...rawRoles] ) => {

    if (!member.match(/\d{17,19}/)){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please supply the ID or mention the member you want roles be added to.`);
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Couldn't find the supplied member on this server`)
    };

    if (!rawRoles.length){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please supply the ID or mention the roles you want to add to this member`);
    };

    const roles = [...new Set([...rawRoles
    .filter(r => r.match(/\d{17,19}/))
    .filter(r => message.guild.roles.cache.has(r.match(/\d{17,19}/)))
    .filter(r => !message.member.roles.cache.has(r.match(/\d{17,19}/)))
    .map(r => r.match(/\d{17,19}/)[0])])];

    if (!roles.length){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, either **${member.user.tag}** already had those roles, or none of the supplied role IDs were valid.`);
    };

    return member.roles.add(roles)
    .then(_member => message.channel.send(`Succesfully added **${roles.length}** roles to **${_member.user.tag}**!`))
    .catch(() => message.channel.send(`Unable to add roles to **${member.user.tag}**`));
  }
};
