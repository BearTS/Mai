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
    const channel = message.member.voice.channel;
      if (!channel)return message.channel.send("I'm sorry but you need to be in a voice channel to play music!");
      const serverQueue = message.client.queue.get(message.guild.id);
      if (!serverQueue) return message.channel.send("There is nothing playing in this server.");
      if (!args[0])return message.channel.send(`The current volume is: **${serverQueue.volume}**`);
       if(isNaN(args[0])) return message.channel.send(':notes: Numbers only!').catch(err => console.log(err));
      if(parseInt(args[0]) > 150 ||(args[0]) < 0) return message.channel.send('You can\'t set the volume more than 150. or lower than 0').catch(err => console.log(err));
      serverQueue.volume = args[0];
      serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
      let sakuvol = new MessageEmbed()
      .setDescription(`I set the volume to: **${args[0]/1}/100**`)
      .setAuthor("Mai Volume Manager", "https://i.imgur.com/A0H2KZ6.png")
      .setColor(`#ffb6c1`)
      .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
      return message.channel.send(sakuvol);
    },
  };
