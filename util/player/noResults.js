const { MessageEmbed } = require("discord.js");

module.exports = (client, message, query) => {
  const embed = new MessageEmbed()
  .setAuthor("No Results Found")
  .setColor(`#ffb6c1`)
  .setDescription(`Your query was ${query}`)
  .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    message.channel.send(embed);
};
