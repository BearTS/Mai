const { MessageEmbed } = require("discord.js");

module.exports = (client, message, query, tracks, content, collector) => {

  const embed = new MessageEmbed()
  .setAuthor("Search Cancelled")
  .setColor(`#b01e0b`)
  .setDescription(`The Search has been **cancelled**`)
  .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

  const embed2 = new MessageEmbed()
          .setAuthor("Invalid Selection")
          .setColor(`#b01e0b`)
          .setDescription(`Must be a valid number between **1** and **${tracks.length}** !`)
          .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    if (content === 'cancel') {
        collector.stop();
        return message.channel.send(embed);
    } else  message.channel.send(embed2);
};
