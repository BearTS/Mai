const sendError = require("../../util/Music.js");

module.exports = {
  name: 'skip',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Skip The Current Playing Song',
  examples: ['skip'],
  parameters: [],
  run:  async function (client, message, args) {
    const channel = message.member.voice.channel
    if (!channel)return sendError("I'm sorry but you need to be in a voice channel to play music!", message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue)return sendError("There is nothing playing that I could skip for you.", message.channel);
    serverQueue.connection.dispatcher.end("Skiped the music");
    message.react("✅")
  },
}

