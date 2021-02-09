module.exports = {
  name: 'shuffle',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Shuffle the queue',
  examples: ['shuffle'],
  parameters: [],
  run:  async function (client, message) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    } else {
      client.musicPlayer.shuffle(message);
      return message.channel.send('Music Queue successfully shuffled!');
    };
  }
};
