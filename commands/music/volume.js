const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'volume',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Change Volume of the music',
  examples: ['volume 50'],
  parameters: ['volume'],
  run:  async function (client, message, [volume = null]) {

    volume = Math.round(volume);

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    } else if (isNaN(volume)){
      return client.musicPlayer.sendError('NOT_A_NUMBER', message, {volume});
    } else if (volume < 1 || volume > 100){
      return client.musicPlayer.sendError('INVALID_NUMBER', message);
    } else {
      client.musicPlayer.setVolume(message, volume);
      return message.channel.send(`Volume successfully set to **${volume}**`);
    };
  }
};
