const { MessageEmbed } = require("discord.js");

module.exports = (client, message, query) => {
  const embed = new MessageEmbed()
  .setAuthor("No Results Found")
  .setColor(`#7e1cd4`)
  .setDescription(`Your query was ${query}`)
  .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    message.channel.send(embed);
};
