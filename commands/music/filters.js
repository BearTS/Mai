const { MessageEmbed } = require("discord.js");
const _ = require('lodash');

module.exports = {
  name: 'filters',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Check all filters',
  examples: ['filters'],
  run:  async function (client, message) {

    if (!message.member.voice.channel){
      return client.musicPlayer.sendError('VC_NOT_FOUND', message);
    } else if (message.guild.me.voice.channel?.id !== message.member.voice.channel.id){
      return client.musicPlayer.sendError('VC_UNIQUE', message);
    } else if (!client.musicPlayer.getQueue(message)){
      return client.musicPlayer.sendError('NO_MUSIC_PLAYING', message);
    }

    function upperCase(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const currentQueue = client.musicPlayer.getQueue(message);
    const emojis = ['<:cancel:788323084770738216>','<a:animatedcheck:788340206691549204>'];
    const filters = currentQueue.filters;
    const filterEntries = _.chunk(Object.entries(filters)
      .map(([k, v]) => `${upperCase(k)} : ${emojis[Number(v)]}`)
    , 10);

    return message.channel.send(
      new MessageEmbed()
      .setAuthor("List Of Filters")
      .setColor(`#4afcff`)
      .setDescription(`List of all filters enabled or disabled.\nUse \`${client.prefix}filter [filter name]\` to add a filter to a song.`)
      .addField('Filters', filterEntries[0].join('\n'), true)
      .addField('\u200b', filterEntries[1].join('\n'), true)
      .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
    );
  }
};
