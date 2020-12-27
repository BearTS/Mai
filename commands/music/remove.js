const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'remove',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'remove a song from queue',
  examples: ['remove 3'],
  parameters: ['Number of the song in the queue'],
  run:  async function (client, message, args) {

    const queue = message.client.queue.get(message.guild.id);
 if (!queue) return message.channel.send("There is no queue.").catch(console.error);
 if (!args.length) return message.channel.send(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
 if (isNaN(args[0])) return message.channel.send(`Usage: ${client.config.prefix}\`remove <Queue Number>\``);
 if (queue.songs.length == 1) return message.channel.send("There is no queue.").catch(console.error);
 if (args[0] > queue.songs.length)
   return message.channel.send(`The queue is only ${queue.songs.length} songs long!`).catch(console.error);
try{
 const song = queue.songs.splice(args[0] - 1, 1);
 message.channel.send(`❌ **|** Removed: **\`${song[0].title}\`** from the queue.`,queue.textChannel).catch(console.error);
                message.react("✅")
} catch (error) {
     return message.channel.send(`An unexpected error occurred.\nPossible type: ${error}`);
   }
},
};
