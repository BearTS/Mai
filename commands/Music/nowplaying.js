const { MessageEmbed } = require("discord.js");
const sendError = require("../../utilities/music.js");

module.exports = {
  name: 'nowplaying',
  aliases: ['np'],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'To show the music which is currently playing in this server',
  examples: ['nowplaying'],
  parameters: [],
  run:  async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("There is nothing playing in this server.", message.channel);
    let song = serverQueue.songs[0]
    let emb = new MessageEmbed()
      .setAuthor("Now Playing", "https://i.imgur.com/tT8YBSA.gif")
      .setThumbnail(song.img)
      .setColor("BLUE")
      .addField("Name", song.title, true)
      .addField("Duration", song.duration, true)
      .addField("Requested by", song.req.tag, true)
      .setFooter(`Views: ${song.views} | ${song.ago}`)
    return message.channel.send(emb)
  },
}

