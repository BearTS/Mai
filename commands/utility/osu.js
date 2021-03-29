const { MessageEmbed } = require("discord.js");
const humanizeDuration = require("humanize-duration");
const osu = require("node-osu");
const osuApi = new osu.Api(process.env.OSU_TOKEN, {
  // baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
  notFoundAsError: false, // Throw an error on not found instead of returning nothing. (default: true)
  completeScores: false, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
  parseNumeric: false, // Parse numeric values into numbers/floats, excluding ids
});
module.exports = {
  name: "osu",
  aliases: ["inspectosu", "osuusercheck"],
  cooldown: {
    time: 10000,
    message:
      "You are going too fast. Please slow down to avoid getting rate-limited!",
  },
  group: "utility",
  clientPermissions: ["EMBED_LINKS"],
  description: "Get basic stats for the mentioned osu! username.",
  parameters: ["OSU! Username"],
  examples: ["osu", "inspectosu", "osuusercheck"],
  run: async (client, message, args) => {
    let username = args[0];
    if (!username)
      return message.channel.send(
        `\\❌ | ${message.author}, Please provide a valid username!`
      );

    osuApi
      .getUser({ u: username })
      .then((user) => {
        if (user.length === 0) {
          return message.channel.send(
            `\\❌ | ${message.author}, Could not find that player!`
          );
        }
        const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setFooter(`osu! | \©️${new Date().getFullYear()} Mai`)
          .setThumbnail(`https://a.ppy.sh/${user.id}`)
          .setAuthor(`${user.name}`, `https://a.ppy.sh/${user.id}`)
          .setURL(`https://osu.ppy.sh/users/${user.id}`)
          .setDescription(`**▸ Rank:** #${user.pp.rank} (${user.country} #${
          user.pp.countryRank
        })
            **▸ Level:** ${Math.round(user.level)}
            **▸ Total PP:** ${Math.round(user.pp.raw)}
            **▸ Accuracy:** ${user.accuracyFormatted}
            **▸ Playcount:** ${user.counts.plays}
            **▸ Joined Data:** ${user.raw_joinDate}
            **▸ Total Playtime:** ${humanizeDuration(
              user.secondsPlayed * 1000,
              { units: ["d", "h", "m"], maxDecimalPoints: 0 }
            )}`);
        message.channel.send(embed);
      })
      .catch((err) => {
        console.log(err);
        message.channel.send(
          `\\❌ | ${message.author}, An unexpected error has occupied while processing your request.`
        );
      });
  },
};
