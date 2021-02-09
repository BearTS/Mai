module.exports = {
  name: 'stop',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Stop the music',
  examples: ['stop'],
  parameters: [],
  run:  async function (client, message) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    } else {
      client.musicPlayer.setRepeatMode(message, false);
      client.musicPlayer.stop(message);

      return message.channel.send('Music Player successfully stopped!');
    };
  },
};
