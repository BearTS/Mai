const { MessageEmbed } = require("discord.js");
const sendError = require("../../util/Music.js");
module.exports = {
  name: 'volume',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Change the volume of the Playing Music',
  examples: ['volume [Number]'],
  parameters: ['Number'],
  run: async function (client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel)return sendError("I'm sorry but you need to be in a voice channel to play music!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return sendError("There is nothing playing in this server.", message.channel);
    if (!args[0])return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
    serverQueue.volume = args[0]; 
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
    let volemb = new MessageEmbed()
    .setDescription(`I set the volume to: **${args[0]/5}/5**(divied by 5)`)
    .setAuthor("Music Volume", "https://i.imgur.com/tT8YBSA.gif")
    .setColor("BLUE")
    return message.channel.send(volemb);
  },
}