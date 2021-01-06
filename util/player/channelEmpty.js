const { MessageEmbed } = require("discord.js");

module.exports = (client, message, queue) => {

  const embed = new MessageEmbed()
  .setAuthor("Player Stopped")
  .setColor(`#ffb6c1`)
  .setDescription("No Members in the Voice channel")
  .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    message.channel.send(embed);
};
