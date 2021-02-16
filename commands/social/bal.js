const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'bal',
  aliases: [ 'balance', 'credits' ],
  group: 'social',
  clientPermissions: [ 'EMBED_LINKS' ],
  description: 'Check your wallet, how much have you earned?',
  requiresDatabase: true,
  examples: [
    'bal',
    'balance',
    'credits'
  ],
  run: (client, message) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    };

    if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, you don't have a wallet yet! To create one, type \`${client.prefix}register\`.`);
    };

    const dailyUsed = doc.data.economy.streak.timestamp !== 0 && doc.data.economy.streak.timestamp - Date.now() > 0;

    function bunnify(cur, max){
      const active = '<:activebunny:810775516641493002>', inactive = '<:inactivebunny:810775684150198292>', left = max - cur === 10 ? 0 : max - cur;
      if (left === 0){
        return dailyUsed ? active.repeat(10) : inactive.repeat(10);
      } else {
        return active.repeat(cur || max) + inactive.repeat(left);
      };
    };

    return message.channel.send(
      new MessageEmbed().setDescription(
        `\u200b\n💰 **${
          text.commatize(doc.data.economy.wallet)
        }** credits in wallet.\n\n${
          doc.data.economy.bank !== null
          ? `💰 **${text.commatize(doc.data.economy.bank)}** credits in bank.`
          : `Seems like you don't have a bank yet.\nCreate one now by typing \`${
            client.config.prefix
          }bank\``
        }\n\n━━━━━━━━━━━━━━\nDaily Streak: **${doc.data.economy.streak.current}** (All time best: **${doc.data.economy.streak.alltime}**)\n**${10 - doc.data.economy.streak.current % 10}** streak(s) left for **Item Reward \\✨**\n\n${
          bunnify(doc.data.economy.streak.current % 10, 10)
        }\n━━━━━━━━━━━━━━\n${
          dailyUsed ? '\\✔️ Daily reward already **claimed**!' : `\\⚠️ Daily reward is **avaliable**!`
        }`
      ).setAuthor(`${message.author.tag}'s wallet`)
      .setColor('GREY')
      .setThumbnail(message.author.displayAvatarURL({dynamic: 'true'}))
      .setFooter(`Profile Balance | \©️${new Date().getFullYear()} Mai`)
    );
  })
};
