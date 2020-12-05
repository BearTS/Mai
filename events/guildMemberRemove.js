const { MessageEmbed } = require('discord.js');
const modifier = require(`${process.cwd()}/util/modifier`);

module.exports = async (client, member) => {

  const guildProfile = client.guildProfiles.get(member.guild.id);

  if (!guildProfile.goodbye.enabled){
    return;
  } else if (!guildProfile.goodbye.channel){
    return;
  } else if (!member.guild.channels.cache.get(guildProfile.goodbye.channel)){
    return;
  } else {
    // Do nothing..
  };

  if (!guildProfile.goodbye.message || guildProfile.goodbye.use === 'default'){
    return client.channels.cache.get(guildProfile.goodbye.channel).send(
      new MessageEmbed()
      .setColor('GREY')
      .setTitle(`${member.user.tag} has left our server!`)
      .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
      .setDescription(`Byebye ${member}!! Sad to see you go!\n\nWe are back to **${member.guild.memberCount - 1}** members!`)
      .setFooter(`Leaving Member Announcer | ©️${new Date().getFullYear()} Mai`)
    );
  };

  if (guildProfile.welcome.use === 'msg'){
    const message = await modifier.modify(guildProfile.goodbye.message, member)
    return client.channels.cache.get(guildProfile.goodbye.channel).send(message);
 };

 return client.channels.cache.get(guildProfile.goodbye.channel).send(
   new MessageEmbed(
     JSON.parse(
       await modifier.modify(JSON.stringify(guildProfile.goodbye.embed), member)))
 );
};
