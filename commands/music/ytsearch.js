const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'ytsearch',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Search for music',
  examples: ['ytsearch Why Sabrina Carpenter'],
  parameters: ['Name of the song'],
  run:  async function (client, message, args) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!args.length){
      return client.musicPlayer.sendError('NO_ARGS_TITLE', message);
    }

    client.musicPlayer.play(message, args.join(' '));
  }
};
