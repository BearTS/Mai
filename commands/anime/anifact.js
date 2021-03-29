const { MessageEmbed } = require("discord.js");
const random = require("anime-facts");

module.exports = {
  name: "anifact",
  aliases: ["af", "animefact"],
  cooldown: {
    time: 5000,
    message:
      "You are going too fast. Please slow down to avoid getting rate-limited!",
  },
  group: "anime",
  clientPermissions: ["EMBED_LINKS"],
  description: "Generate a random anime fact.",
  parameters: [],
  examples: ["anifact", "af", "animefact"],
  run: async (client, message) => {
    random.getFact().then((r) => {
      message.channel.send(
        new MessageEmbed()
          .setColor(`RANDOM`)
          .setTitle(`Did you know?`)
          .setThumbnail(
            `https://thumbs.gfycat.com/ReliableSkeletalCanvasback-size_restricted.gif`
          )
          .setDescription(r.fact)
          .setTimestamp()
          .setFooter(`Anime Facts | \©️ ${new Date().getFullYear()} Mai`)
      );
    });
  },
};
