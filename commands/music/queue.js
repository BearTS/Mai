module.exports = {
  name: 'queue',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Show the Player queue',
  examples: ['queue'],
  parameters: [],
  run:  async function (client, message) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    } else {
      const currentQueue = client.musicPlayer.getQueue(message);

      return message.channel.send([
        `**Server Queue - ${message.guild.name} ${currentQueue.loopMode ? '(looped)' : ''}**`,
        `Current: ${currentQueue.playing.title} | ${currentQueue.playing.author}\n`,
        currentQueue.tracks.map((track, i) => {
          return `**#${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy.username})`;
        }).slice(0, 5).join('\n'),
        `\n${currentQueue.tracks.length > 5 ? `And **${currentQueue.tracks.length - 5}** other songs...` : `In the playlist **${currentQueue.tracks.length}** song(S)...`}`
      ].join('\n'));
    };
  }
};
