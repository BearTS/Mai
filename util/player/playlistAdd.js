const { MessageEmbed } = require("discord.js");

module.exports = (client, message, queue, playlist) => {

  const embed = new MessageEmbed()
  .setAuthor("Added to Queue", "https://i.imgur.com/FEQnDbl.gif")
  .setColor(`#0fd440`)
  .setDescription(`${playlist.title} with **${playlist.tracks.length}** songs has been added to queue`)
  .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    message.channel.send(embed);
};
