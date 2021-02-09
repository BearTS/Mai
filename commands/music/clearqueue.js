const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'clearqueue',
  aliases: ['clear-queue'],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Add Filter to the current song',
  examples: ['clearqueue'],
  parameters: [],
  run:  async function (client, message) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    } else if (client.musicPlayer.getQueue(message).tracks.length === 1){
      return client.musicPlayer.sendError('ONE_MUSIC_PLAYING', message);
    } else {

      client.musicPlayer.clearQueue(message);

      return message.channel.send(
        new MessageEmbed()
        .setAuthor("Music Queue Cleared")
        .setColor(`#ffb6c1`)
        .setDescription(`Yay! Don't forget to [vote for me](${client.config.websites['top.gg']})`)
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
      );
    };
  }
};
