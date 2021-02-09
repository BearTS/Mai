module.exports = {
  name: 'play',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Play songs from Soundcloud, Spotify or Youtube',
  examples: ['play Why by Sabrina Carpenter', 'play https://www.youtube.com/watch?v=fhH4pbRJh0k'],
  parameters: ['Song name or URl of the song or playlist'],
  run:  async function (client, message, args) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!args.length){
      return client.musicPlayer.sendError('NO_ARGS_TITLE', message);
    } else {
      const query = args.join(' ');
      const options = { firstResult: true };
      client.musicPlayer.play(message, query, options);
    };
  }
};
