const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'loop',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Toggle Loop of the Music system of Mai',
  examples: ['loop'],
  parameters: [],
  run:  async function (client, message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);
      if (serverQueue) {
           serverQueue.loop = !serverQueue.loop;
          let sakuloop = new MessageEmbed()
          .setDescription(`🔁  **|**  Loop is **\`${serverQueue.loop === true ? "enabled" : "disabled"}\`**`)
          .setColor(`#ffb6c1`)
          .setAuthor("Loop Toggle!", "https://i.imgur.com/A0H2KZ6.png")
          .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
           return message.channel.send(sakuloop);
       };
   return message.channel.send("There is nothing playing in this server.");
 },
};
