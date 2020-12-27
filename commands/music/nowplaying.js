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
  run:  async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
      if (!serverQueue) return message.channel.send("There is nothing playing in this server.");
      let song = serverQueue.songs[0]
      let sakunp = new MessageEmbed()
        .setAuthor("Now Playing", "https://i.imgur.com/A0H2KZ6.png")
        .setColor(`#ffb6c1`)
        .addField("Title", song.title, true)
        .addField("Duration of song", song.duration, true)
        .addField("Requested by", song.req.tag, true)
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
      return message.channel.send(sakunp)
    },
  };
