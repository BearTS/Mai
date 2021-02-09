module.exports = {
  name: 'resume',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Resume the Pause Player',
  examples: ['Resume'],
  parameters: ['Song name or URl of the song'],
  run:  async function (client, message) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    } else if (!client.musicPlayer.getQueue(message).paused){
      return client.musicPlayer.sendError('RESUME_ALREADY_PLAYING', message);
    } else {
      client.musicPlayer.resume(message);
      return message.channel.send('Music successfully resumed!');
    };
  },
};
