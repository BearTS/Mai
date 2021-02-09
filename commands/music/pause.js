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

    const samevc = new MessageEmbed()
    .setAuthor("You Must be in the same voice channel")
    .setColor(`#f04e48`)
    .setDescription("Baka Baka Baka")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const joinvc = new MessageEmbed()
    .setAuthor("You Must be in a voice channel")
    .setColor(`#f04e48`)
    .setDescription("Where will I even play songs!!?! ")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const nomusic = new MessageEmbed()
    .setAuthor("There is no music playing")
    .setColor(`#f04e48`)
    .setDescription("Baka")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const paused = new MessageEmbed()
    .setAuthor("Player is already Pause")
    .setColor(`#f04e48`)
    .setDescription("Use `resume` to resume the music")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const success = new MessageEmbed()
    .setAuthor("Player Paused")
    .setColor(`#ffb6c1`)
    .setDescription("Yay Don't Forget to [vote for me](https://top.gg/702074452317307061/vote)")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

     if (!message.member.voice.channel) return message.channel.send(joinvc);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

        if (!client.player.getQueue(message)) return message.channel.send(nomusic);

        if (client.player.getQueue(message).paused) return message.channel.send(paused);

        client.player.pause(message);

        message.channel.send(success);
    },
};
