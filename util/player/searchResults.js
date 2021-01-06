const { MessageEmbed } = require("discord.js");

module.exports = (client, message, query, tracks) => {

  const embed = new MessageEmbed()
  .setAuthor("Search Results", "https://i.imgur.com/eVr8AKk.gif")
  .setTitle("Choose an option from below")
  .setColor(`#38e076`)
  .setDescription(`${tracks.map((t, i) => `**${i + 1}** - ${t.title}`).join('\n')}`)
  .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    message.channel.send(embed);
};
