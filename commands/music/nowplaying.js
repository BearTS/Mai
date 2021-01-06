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

        const samevc = new MessageEmbed()
        .setAuthor("You Must be in the same voice channel")
        .setColor(`#f04e48`)
        .setDescription("Baka Baka Baka")
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

        const joinvc = new MessageEmbed()
        .setAuthor("You Must be in a voice channel")
        .setColor(`#f04e48`)
        .setDescription("Where will I even play songs!!?! ")
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

        const nomusic = new MessageEmbed()
        .setAuthor("There is no music playing")
        .setColor(`#f04e48`)
        .setDescription("Baka")
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

   if (!message.member.voice.channel) return message.channel.send(joinvc);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

        if (!client.player.getQueue(message)) return message.channel.send(nomusic);

        const track = client.player.nowPlaying(message);
        const filters = [];

        Object.keys(client.player.getQueue(message).filters).forEach((filterName) => client.player.getQueue(message).filters[filterName]) ? filters.push(filterName) : false;

        const nowplaying = new MessageEmbed()
        .setAuthor("Now Playing", "https://i.imgur.com/VE7LTIP.gif")
        .setColor(`#ffb6c1`)
        .setTitle(track.title)
        .addField('From Playlist', track.fromPlaylist ? 'Yes' : 'No', true)
        .addField('Currently paused', client.player.getQueue(message).paused ? 'Yes' : 'No', true)
        .addField('Requested by', track.requestedBy.username, true)
        .addField('Filters activated', filters.length + '/' + client.filters.length, true)
        .addField('Volume', client.player.getQueue(message).volume, true)
        .addField('Repeat mode', client.player.getQueue(message).repeatMode ? 'Yes' : 'No', true)
        .addField('Progress bar', client.player.createProgressBar(message, { timecodes: true }), true)
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

        message.channel.send(nowplaying);
    },
};
