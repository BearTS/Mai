const guildProfileSchema = require(`${process.cwd()}/models/GuildProfile`);
const consoleUtil = require(`${process.cwd()}/util/console`);
const { Error } = require('mongoose');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, guild) => {
  
if (!guild.members.cache.has(guild.ownerID)) await guild.members.fetch(guild.ownerID);
		const embed = new MessageEmbed()
			.setColor(0x7CFC00)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Joined ${guild.name}!`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', guild.memberCount)
			.addField('❯ Owner', guild.owner.user.tag);
		await client.channels.cache.get(`751164145927323782`).send(embed)

  let data = await guildProfileSchema.findOne({
    guildID: guild.id
  }).catch((err) => null) || await new guildProfileSchema({
    guildID: guild.id
  }).save().catch(err => err);

  if (data instanceof Error){
    consoleUtil.error(
        'Unable to find/register guild '
      + guild
      + 'on/to mongo Database.\n'
      + data.name
    );
  };

  client.guildProfiles.set(
      guild.id
    , data || { guildID : guild.id }
  );
};
