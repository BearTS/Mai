const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/Music.js");

module.exports = {
  name: 'queue',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Check The Current Music Queue',
  examples: ['queue'],
  parameters: [],
  run: async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("There is nothing playing in this server.", message.channel);

    let queue = new MessageEmbed()
    .setAuthor("Server Songs Queue", "https://i.imgur.com/tT8YBSA.gif")
    .setColor("BLUE")
    .addField("Now Playing", serverQueue.songs[0].title, true)
    .addField("Text Channel", serverQueue.textChannel, true)
    .addField("Voice Channel", serverQueue.voiceChannel, true)
    .setDescription(serverQueue.songs.map((song) => {
      if(song === serverQueue.songs[0])return
      return `**-** ${song.title}`
    }).join("\n"))
    .setFooter("Currently Server Volume is "+serverQueue.volume)
    if(serverQueue.songs.length === 1)queue.setDescription(`No songs to play next add songs by \`\`m!play <song_name>\`\``)
    message.channel.send(queue)
  },
}