const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "awallpaper",
  description: "Get a anime wallpaper",
  group: "anime",
  category: "animals",
  run: async (client, message) => {
    const data = await fetch("https://nekos.life/api/v2/img/wallpaper").then((res) =>
      res.json()
    );

    const embed = new MessageEmbed()
      .setFooter(message.author.username)
      .setColor("0x000000")
      .setDescription(`[Click here if the image failed to load.](${data.url})`)
      .setImage(`${data.url}`)
      .setFooter(`Anime Wallpaper | \©️${new Date().getFullYear()} Mai`)
        .setTimestamp()

    message.channel.send(embed);
  },
};