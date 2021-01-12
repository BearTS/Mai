const fetch = require("node-fetch")
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "aavatar",
    category: "anime",
    aliases: ["apfp"],
    group: "anime",
    description: "Send a Anime avatar",
    usage: "",
    run: async (client, message, args) =>
    {
      const { url } = await fetch(`https://nekos.life/api/v2/img/${message.channel.nsfw ? "nsfw_" : ""}avatar`)
      .then((res) => res.json());

      const embed = new MessageEmbed() .setTitle(`${message.channel.nsfw ? "NSFW " : ""}Anime Avatar`) .setImage(url)
      .setFooter(`Anime Avatar | \©️${new Date().getFullYear()} Mai`)
        .setTimestamp()
      return message.channel.send({ embed });
    }
}
