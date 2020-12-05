const { MessageEmbed } = require('discord.js');
const modifier = require(`${process.cwd()}/util/modifier`);
const string = require(`${process.cwd()}/util/string`);

module.exports = async ( client, member ) => {

  const guildProfile = client.guildProfiles.get(member.guild.id);

  if (!guildProfile.welcome.enabled){
    return;
  } else if (!guildProfile.welcome.channel){
    return;
  } else if (!member.guild.channels.cache.get(guildProfile.welcome.channel)){
    return;
  } else {
    // Do nothing..
  };

  if (!guildProfile.welcome.message || guildProfile.welcome.use === 'default'){
    return client.channels.cache.get(guildProfile.welcome.channel).send(
      new MessageEmbed()
      .setColor('GREY')
      .setTitle(`${member.user.tag} has joined our server!`)
      .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
      .setDescription(`Hello ${member}, welcome to **${member.guild.name}**!\n\nYou are our **${string.ordinalize(member.guild.memberCount)}** member!`)
      .setFooter(`Member Greeter | ©️${new Date().getFullYear()} Mai`)
    );
  };

  //if message was text, send the text
  if (guildProfile.welcome.use === 'msg'){
    const message = await modifier.modify(guildProfile.welcome.message, member);
    return client.channels.cache.get(guildProfile.welcome.channel).send(message);
 };

  //if message was embed
  return client.channels.cache.get(guildProfile.welcome.channel).send(
    new MessageEmbed(
      JSON.parse(
        await modifier.modify(JSON.stringify(guildProfile.welcome.embed), member)))
  );
};
