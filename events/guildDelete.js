const { MessageEmbed } = require('discord.js');

module.exports = (client, guild) => {
  if (client.config.channels.logs){
    const channel = client.channels.cache.get(client.config.channels.logs);
    if (!channel){
      return;
    } else {
      channel.send(
        new MessageEmbed()
        .setTimestamp()
        .setColor('GREY')
        .setFooter(`ID: ${guild.id}`)
        .setTitle(`Left ${guild.name}!`)
        .setThumbnail(guild.iconURL({ format: 'png' }))
        .addFields([
          { name: '❯\u2000\u2000Members', value: guild.memberCount, inline: true },
          { name: '❯\u2000\u2000Owner', value: guild.owner?.user?.tag || 'Uncached', inline: true }
        ])
      );
    };
  };
}
