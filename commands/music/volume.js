const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'volume',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Change Volume of the music',
  examples: ['volume 50'],
  parameters: ['volume'],
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

    const validno = new MessageEmbed()
    .setAuthor("Enter a Valid number")
    .setColor(`#f04e48`)
    .setDescription("Baka")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

    const valid = new MessageEmbed()
    .setAuthor("Enter a Valid number")
    .setColor(`#f04e48`)
    .setDescription("Baka! It should be between 1 to 100")
    .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

  if (!message.member.voice.channel) return message.channel.send(joinvc);

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(samevc);

    if (!client.player.getQueue(message)) return message.channel.send(nomusic);

        if (!args[0] || isNaN(args[0]) || args[0] === 'Infinity') return message.channel.send(validno);

        if (Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 100) return message.channel.send(valid);

        client.player.setVolume(message, parseInt(args[0]));

        const success = new MessageEmbed()
        .setAuthor(`Volume Changed Successfully`)
        .setColor(`#ffb6c1`)
        .setDescription(`Current Volume **${parseInt(args[0])}%**`)
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

        message.channel.send(success);
    },
};
