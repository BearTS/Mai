const { MessageEmbed } = require("discord.js");
const { punch } = require("../../assets/json/images.json");

module.exports = {
  name: "punch",
  aliases: [],
  guildOnly: true,
  clientPermissions: ["EMBED_LINKS", "ADD_REACTIONS"],
  group: "action",
  description: "UWAA~!",
  examples: ["punch"],
  parameters: [],
  run: async (client, message, args) => {
    return message.channel.send(
      new MessageEmbed()
        .setColor("GREY")
        .setDescription(`${message.mentions.members.first()} got punched by ${message.member}! rip!`)
        .setImage(
          `https://i.imgur.com/${
            punch[Math.ceil(Math.random() * punch.length)]
          }.gif`
        )
        .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);
        )
    );
  }
};
