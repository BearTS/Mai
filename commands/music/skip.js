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

    const success = new MessageEmbed()
    .setAuthor("Song Skipped")
    .setColor(`#ffb6c1`)
    .setDescription("Yay Don't Forget to [vote for me](https://top.gg/702074452317307061/vote)")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

  if (!message.member.voice.channel) return message.channel.send(joinvc);

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

    if (!client.player.getQueue(message)) return message.channel.send(nomusic);

        client.player.skip(message);

        message.channel.send(success);
    },
};
