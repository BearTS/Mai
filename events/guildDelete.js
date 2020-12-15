const { MessageEmbed } = require('discord.js');

module.exports = async (client, guild) => {

		if (!guild.members.cache.has(guild.ownerID)) await guild.members.fetch(guild.ownerID);
		const embed = new MessageEmbed()
			.setColor(0xFF0000)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Left ${guild.name}...`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', guild.memberCount)
			.addField('❯ Owner', guild.owner.user.tag);
		await client.channels.cache.get(`751164145927323782`).send(embed)
}
