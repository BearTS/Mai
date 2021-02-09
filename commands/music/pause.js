module.exports = {
  name: 'pause',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Pause the current music playing',
  examples: ['pause'],
  parameters: [],
  run:  async function (client, message, args) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    } else if (client.musicPlayer.getQueue(message).paused){
      return client.musicPlayer.sendError('MUSIC_PAUSED', message);
    } else {
      client.musicPlayer.pause(message);
      return message.channel.send('Music successfully paused!');
    };
  }
};
