const { MessageEmbed } = require("discord.js");

module.exports = (client, message, track) => {

  const embed = new MessageEmbed()
  .setAuthor("Now Playing", "https://i.imgur.com/2UOMwYK.gif")
  .setColor(`#ffb6c1`)
  .setTitle(track.title)
  .addField('[Invite Me](https://invite.mai-san.ml/)', '[Website](https://mai-san.ml)', true)
  .addField('Volume', client.player.getQueue(message).volume, true)
  .addField('Requested by', track.requestedBy.username, true)
  .addField('Progress bar', client.player.createProgressBar(message, { timecodes: true }), true)
  .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    message.channel.send(embed);
};
