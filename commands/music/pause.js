const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'pause',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Pause the current music playing',
  examples: ['pause'],
  parameters: [],
  run:  async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
      if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
  	    try{
        serverQueue.connection.dispatcher.pause()
  	  } catch (error) {
          message.client.queue.delete(message.guild.id);
          return message.channel.send(`:notes: The player has stopped and the queue has been cleared.: ${error}`);
        }
        let sakuplay = new MessageEmbed()
        .setDescription("⏸ Paused the music")
        .setColor(`#ffb6c1`)
        .setTitle("Music has been paused!")
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
        return message.channel.send(sakuplay);
      }
      return message.channel.send("There is nothing playing in this server.");
    },
  };
