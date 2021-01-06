const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'clearqueue',
  aliases: ['clear-queue'],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Add Filter to the current song',
  examples: ['clearqueue'],
  parameters: [],
  run:  async function (client, message) {

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

    const onesong = new MessageEmbed()
    .setAuthor("There is only one song playing")
    .setColor(`#f04e48`)
    .setDescription("use `stop` or `skip` to **stop** the music")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const success = new MessageEmbed()
    .setAuthor("Music Queue Cleared")
    .setColor(`#ffb6c1`)
    .setDescription("Yay Don't Forget to [vote for me](https://top.gg/702074452317307061/vote)")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

             if (!message.member.voice.channel) return message.channel.send(joinvc);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

        if (!client.player.getQueue(message)) return message.channel.send(nomusic);

        if (client.player.getQueue(message).tracks.length <= 1) return message.channel.send(onesong);

        client.player.clearQueue(message);

        message.channel.send(success);
    },
};
