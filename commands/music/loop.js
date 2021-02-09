const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'loop',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Toggle Loop of the Music system of Mai',
  examples: ['loop'],
  parameters: [],
  run:  async function (client, message, args) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    } else {
      const argument = args.join(' ').toLowerCase();
      const currentQueue = client.musicPlayer.getQueue(message);

      function sendEmbed({author, description}){
        return message.channel.send(
          new MessageEmbed()
          .setColor('#ffb6c1')
          .setAuthor(author||null)
          .setDescription(description||'')
          .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
        );
      };

      if (argument === 'queue'){
        sendEmbed({
          author: [
            'Loop Enabled!', 'Loop Disabled!'
          ][Number(currentQueue.loopMode)],
          description: [
            'The whole queue will be played in loop!',
            `Yay! Don't forget to [vote for me](${client.config.websites['top.gg']})`
          ][Number(currentQueue.loopMode)]
        });
        client.musicPlayer.setLoopMode(message, !currentQueue.loopMode);
      } else {
        sendEmbed({
          author: [
            'Loop Enabled!', 'Loop Disabled!'
          ][Number(currentQueue.repeatMode)],
          description: [
            'The current song will be played in loop',
            `Yay! Don't forget to [vote for me](${client.config.websites['top.gg']})`
          ]
        });
        client.musicPlayer.setRepeatMode(message, !currentQueue.repeatMode);
      }
    };
  }
};
