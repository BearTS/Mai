const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'play',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Play songs from Soundcloud,Spotify or Youtube',
  examples: ['play Why by Sabrina Carpenter', 'play https://www.youtube.com/watch?v=fhH4pbRJh0k'],
  parameters: ['Song name or URl of the song or playlist'],
  run:  async function (client, message, args) {

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

    const title = new MessageEmbed()
    .setAuthor("Tell me the name of the song")
    .setColor(`#ffb6c1`)
    .setDescription("Baka")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

         if (!message.member.voice.channel) return message.channel.send(joinvc);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

        if (!args[0]) return message.channel.send(title);

        client.player.play(message, args.join(" "), { firstResult: true });
    },
};
