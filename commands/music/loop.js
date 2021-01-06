const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'loop',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Toggle Loop of the Music system of Tamako',
  examples: ['loop'],
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

           if (!message.member.voice.channel) return message.channel.send(joinvc);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

        if (!client.player.getQueue(message)) return message.channel.send(nomusic);

        if (args.join(" ").toLowerCase() === 'queue') {
            if (client.player.getQueue(message).loopMode) {

              const loop = new MessageEmbed()
              .setAuthor("Loop Disabled")
              .setColor(`#ffb6c1`)
              .setDescription("Yay Don't Forget to [vote for me](https://top.gg/702074452317307061/vote)")
              .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

                client.player.setLoopMode(message, false);
                return message.channel.send(`${client.emotes.success} - Loop **disabled** !`);
            } else {

              const loop = new MessageEmbed()
              .setAuthor("Loop Enabled")
              .setColor(`#ffb6c1`)
              .setDescription("The Whole Queue will be played in loop")
              .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

                client.player.setLoopMode(message, true);
                return message.channel.send(loop);
            };
        } else {
            if (client.player.getQueue(message).repeatMode) {

              const loop = new MessageEmbed()
              .setAuthor("Loop Disabled")
              .setColor(`#ffb6c1`)
              .setDescription("Yay Don't Forget to [vote for me](https://top.gg/702074452317307061/vote)")
              .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

                client.player.setRepeatMode(message, false);
                return message.channel.send(loop);
            } else {

              const loop = new MessageEmbed()
              .setAuthor("Loop Enabled")
              .setColor(`#ffb6c1`)
              .setDescription("The current song will be played in loop")
              .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

                client.player.setRepeatMode(message, true);
                return message.channel.send(loop);
            };
        };
    },
};
