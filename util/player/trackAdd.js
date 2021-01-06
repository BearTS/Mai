const { MessageEmbed } = require("discord.js");

module.exports = (client, message, queue, track) => {

  const embed = new MessageEmbed()
  .setAuthor("Added to Queue", "https://i.imgur.com/FEQnDbl.gif")
  .setColor(`#71e810`)
  .setDescription(`${track.title} has been added to the queue!`)
  .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    message.channel.send(embed);
};
