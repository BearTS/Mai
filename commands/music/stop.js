const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'stop',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Stop the music',
  examples: ['stop'],
  parameters: [],
  run:  async function (client, message, args) {
    const channel = message.member.voice.channel
     if (!channel)return message.channel.send("I'm sorry but you need to be in a voice channel to play music!");
     const serverQueue = message.client.queue.get(message.guild.id);
     if (!serverQueue)return message.channel.send("There is nothing playing that I could stop for you.");
    if(!serverQueue.connection)return
 if(!serverQueue.connection.dispatcher)return
      try{
       serverQueue.connection.dispatcher.end();
       } catch (error) {
         message.guild.me.voice.channel.leave();
         message.client.queue.delete(message.guild.id);
         return message.channel.send(`Music System Of Mai has stopped: ${error}`);
       }
     message.client.queue.delete(message.guild.id);
     serverQueue.songs = [];
     message.react("✅")
   },
 };
