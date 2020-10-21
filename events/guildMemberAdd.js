const { MessageEmbed } = require('discord.js');
const { TextHelpers: text } = require('../helper');

module.exports = async ( client, member ) => {

  const guildProfile = client.guildsettings.get(member.guild.id)

  if (
    !guildProfile.welcome.enabled
    || !guildProfile.welcome.channel
    || !member.guild.channels.cache.get(guildProfile.welcome.channel)
  ) return

  //if message was not set or the message is set to default, use the default
  if (
    !guildProfile.welcome.message
    || guildProfile.welcome.use === 'default'
  ) return client.channels.cache.get(guildProfile.welcome.channel).send(
    new MessageEmbed()
    .setColor('GREY')
    .setTitle(`${member.user.tag} has joined our server!`)
    .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
    .setDescription(`Hello ${member}, welcome to **${member.guild.name}**!\n\nYou are our **${text.ordinalize(member.guild.memberCount)}** member!`)
    .setFooter(`Member Greeter | ©️2020 Mai`)
  )

  //if message was text, send the text
  if (guildProfile.welcome.use === 'msg'){
   return client.channels.cache.get(guildProfile.welcome.channel).send(await modifier(guildProfile.welcome.message, member));
  }
  
  //if message was embed
  return client.channels.cache.get(guildProfile.welcome.channel).send(
    new MessageEmbed(
      JSON.parse(await modifier(JSON.stringify(guildProfile.welcome.embed), member)))
  );


}

async function modifier(str, member){
 const owner = await member.guild.members.fetch(member.guild.ownerID)
 return str.replace(/{avatar}|{avatarDynamic}|{channelCount}|{categoryChannelCount}|{textChannelCount}|{voiceChannelCount}|{createdAt}|{createdAtMDY}|{discriminator}|{displayColor}|{displayName}|{guildIcon}|{guildIconDynamic}|{guildName}|{guildOwner}|{guildOwnerNickname}|{guildOwnerTag}|{guildOwnerDiscrim}|{guildOwnerAvatar}|{guildOwnerAvatarDynamic}|{joinedAt}|{joinedAtMDY}|{memberCount}|{tag}|{user}|{userNickname}|{userTag}|{userDiscrim}|{userAvatar}|{userAvatarDynamic}|{usermention}|{memberJoinRank}|{memberJoinRankOrdinalized}/g, (word) => {
  const modifiers = {
    "{avatar}": member.user.displayAvatarURL(),
    "{avatarDynamic}": member.user.displayAvatarURL({ dynamic: true, format: 'png'}),
    "{channelCount}": member.guild.channels.cache.size,
    "{categoryChannelCount}": member.guild.channels.cache.filter( c => c.type === 'category'),
    "{textChannelCount}": member.guild.channels.cache.filter( c => c.type === 'text'),
    "{voiceChannelCount}": member.guild.channels.cache.filter( c => c.type === 'voice'),
    "{createdAt}": member.user.createdAt,
    "{createdAtMDY}": text.timeZoneConvert(member.user.createdAt),
    "{discriminator}": member.user.discriminator,
    "{displayColor}": member.displayColor,
    "{displayName}": member.displayName,
    "{guildIcon}": member.guild.iconURL(),
    "{guildIconDynamic}": member.guild.iconURL({dynamic: true, format: 'png'}),
    "{guildName}": member.guild.name,
    "{guildOwner}":  owner.user.username,
    "{guildOwnerNickname}": owner.displayName,
    "{guildOwnerTag}": owner.user.tag,
    "{guildOwnerDiscrim}": owner.user.discriminator,
    "{guildOwnerAvatar}": owner.user.displayAvatarURL(),
    "{guildOwnerAvatarDynamic}": owner.user.displayAvatarURL({dynamic: true, format: 'png'}),
    "{joinedAt}": member.joinedAt,
    "{joinedAtMDY}": text.timeZoneConvert(member.joinedAt),
    "{memberCount}": member.guild.memberCount,
    "{tag}": member.user.tag,
    "{user}": member.user.username,
    "{userNickname}": member.displayName,
    "{userTag}": member.user.tag,
    "{userDiscrim}": member.user.discriminator,
    "{userAvatar}": member.user.displayAvatarURL({ dynamic: 'true', format: 'png'}),
    "{userAvatarDynamic}": member.user.displayAvatarURL,
    "{usermention}": member.toString(),
    "{memberJoinRank}": member.guild.memberCount,
    "{memberJoinRankOrdinalized}": text.ordinalize(member.guild.memberCount)
  }
  return modifiers[word]
 })
}
