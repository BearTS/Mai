const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'userinfo',
  aliases: ['whois'],
  guildOnly: true,
  group: "utility",
  description: 'Fetch User Information (As of May 20, 2020 - The global function has been removed due to a possible violation to Discord ToS).',
  parameters: [ 'User Mention/ID' ],
  examples: [
    'userinfo @user',
    'whois 75869504958675123'
  ],
  run: async(client, message, [member='']) => {

    if (!member.match(/\d{17,19}/)){
      member = message.author.id
    };

    member = await message.guild.members
    .fetch(member.match(/\d{17,19}/)[0])
    .catch(() => null);

    if (!member){
      return message.channel.send(`\\❌ | ${message.author}, Could not find that user in this server!`);
    };

    const user = member.user;
    const userFlags = await user.fetchFlags()
    .then(flags => Promise.resolve(Object.entries(flags.serialize()).filter(([_, val]) => !!val)))
    .then(flags => flags.map(([key, _]) => client.emojis.cache.find(x => x.name === key)?.toString() || key))
    .catch(() => []);

    if (message.guild.ownerID === user.id){
      userFlags.push('<a:GUILD_OWNER:731117984730316811>')
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor(member.displayColor || 'GREY')
      .setAuthor(`Discord user ${user.tag}`, null, 'https://discord.com/')
      .setDescription(userFlags.join(' '))
      .setThumbnail(user.displayAvatarURL({format: 'png', dynamic: true}))
      .setFooter(`Userinfo | ©️${new Date().getFullYear()} Mai`)
      .addFields([
        { name: 'Username', value: `**${user.username}**#${user.discriminator}`, inline: true },
        { name: 'Type', value: user.bot ? 'Bot' : 'User', inline: true },
        { name: 'Joined Discord', value: moment(user.createdAt).format('dddd, do MMMM YYYY') },
        { name: `Roles [${member.roles.cache.size - 1}]`, value: member.roles.cache.filter(r => r.id !== message.guild.id).map(x => `${x}`).splice(0,50).join(' ') || '\u200b'}
      ])
    );
  }
};
