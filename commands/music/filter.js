const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'filter',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Toggle Filter to the current song',
  examples: ['filter [filter name]'],
  parameters: ['filter name'],
  run:  async function (client, message, [filter]) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    } else if (!filter){
      return client.musicPlayer.sendError('MISSING_FILTER', message);
    } else {
      filter = filter.toLowerCase();

      const currentQueue = client.musicPlayer.getQueue(message);
      const filterStatus = currentQueue.filters[filter];

      if (typeof filterStatus !== 'boolean'){
        return client.musicPlayer.sendError('UNKNOWN_FILTER', message);
      };

      function send(boolean){
        return message.channel.send(
          new MessageEmbed()
          .setColor(`#ffb6c1`)
          .setAuthor(`Filter "${filter}" ${boolean ? 'Enabled' : 'Disabled'}!`)
          .setDescription(`Yay! Don't forget to [vote for me](${client.config.websites['top.gg']})`)
          .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
        );
      };

      client.musicPlayer.setFilters(message, {[filter]: !filterStatus});
      return send(!filterStatus);
    };
  }
};
