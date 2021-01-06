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
  run:  async function (client, message) {

          const samevc = new MessageEmbed()
          .setAuthor("You Must be in the same voice channel")
          .setColor(`#ffb6c1`)
          .setDescription("Baka Baka Baka")
          .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

          const joinvc = new MessageEmbed()
          .setAuthor("You Must be in a voice channel")
          .setColor(`#ffb6c1`)
          .setDescription("Where will I even play songs!!?! ")
          .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

          const nomusic = new MessageEmbed()
          .setAuthor("There is no music playing")
          .setColor(`#ffb6c1`)
          .setDescription("Baka")
          .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

          const success = new MessageEmbed()
          .setAuthor("Queue Shuffled")
          .setColor(`#ffb6c1`)
          .setDescription("Yay Don't Forget to [vote for me](https://top.gg/702074452317307061/vote)")
          .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

     if (!message.member.voice.channel) return message.channel.send(joinvc);

          if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

          if (!client.player.getQueue(message)) return message.channel.send(nomusic);

        client.player.shuffle(message);

        return message.channel.send(success);
    },
};
