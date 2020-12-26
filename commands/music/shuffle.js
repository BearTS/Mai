const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'shuffle',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Shuffle the queue',
  examples: ['shuffle'],
  parameters: [],
  run:  async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
       if (!serverQueue) return sendError("There is no queue.",message.channel).catch(console.error);
   try{
       let songs = serverQueue.songs;
       for (let i = songs.length - 1; i > 1; i--) {
         let j = 1 + Math.floor(Math.random() * i);
         [songs[i], songs[j]] = [songs[j], songs[i]];
       }
       serverQueue.songs = songs;
       message.client.queue.set(message.guild.id, serverQueue);
       message.react("✅")
         } catch (error) {
           message.guild.me.voice.channel.leave();
           message.client.queue.delete(message.guild.id);
           return message.channel.send(`Music System of Mai has stopped.: \`${error}\``);
        }
     },
   };
