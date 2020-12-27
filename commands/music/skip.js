const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'skip',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Skip the current playing song',
  examples: ['skip'],
  parameters: [],
  run:  async function (client, message, args) {
    const channel = message.member.voice.channel
  if (!channel)return message.channel.send("You need to be in a voice channel to play music!");
  const serverQueue = message.client.queue.get(message.guild.id);
  if (!serverQueue)return message.channel.send("There is nothing playing that I could skip for you.");
      if(!serverQueue.connection)return
if(!serverQueue.connection.dispatcher)return
   if (serverQueue && !serverQueue.playing) {
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    let resumemai = new MessageEmbed()
    .setDescription("▶ Resumed the music for you!")
    .setColor(`#ffb6c1`)
    .setTitle("Music has been Resumed!")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
 return message.channel.send(resumemai).catch(err => console.log(err));

  }


     try{
    serverQueue.connection.dispatcher.end()
    } catch (error) {
      serverQueue.voiceChannel.leave()
      message.client.queue.delete(message.guild.id);
      return message.channel.send(`Music System Of Mai stopped.: ${error}`);
    }
  message.react("✅")
},
};
