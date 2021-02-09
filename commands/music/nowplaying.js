const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'nowplaying',
  aliases: ['np'],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Show the currently playing music',
  examples: ['nowplaying'],
  parameters: [],
  run:  async function (client, message) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    };

    const currentQueue = client.musicPlayer.getQueue(message);
    const choice = ['No', 'Yes'];

    const track = client.musicPlayer.nowPlaying(message);
    const filters = currentQueue.filters;
    const paused = currentQueue.paused;
    const volume = currentQueue.volume;
    const repeatMode = currentQueue.repeatMode;
    const progress = client.musicPlayer.createProgressBar(message, {timecodes: true});
    const enabledFilters = Object.entries(filters).filter(([k,v]) => v);

    return message.channel.send(
      new MessageEmbed()
      .setAuthor("Now Playing", "https://i.imgur.com/2UOMwYK.gif")
      .setColor(`#ffb6c1`)
      .setTitle(track.title)
      .addField('From Playlist', choice[Number(track.fromPlaylist)], true)
      .addField('Currently paused', choice[Number(paused)], true)
      .addField('Requested by', track.requestedBy.username, true)
      .addField('Filters activated', enabledFilters.length + '/' + Object.keys(filters).length, true)
      .addField('Volume', volume, true)
      .addField('Repeat mode', choice[Number(repeatMode)], true)
      .addField('Progress bar', progress, true)
      .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
    );
  }
};
