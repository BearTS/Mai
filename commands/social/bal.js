const { MessageEmbed } = require('discord.js');
const text = require(`${process.cwd()}/util/string`);
const profile = require(`${process.cwd()}/models/Profile`);

module.exports = {
  name: 'bal',
  aliases: [ 'balance', 'credits' ],
  guildOnly: true,
  group: 'social',
  clientPermissions: [ 'EMBED_LINKS' ],
  description: 'Check your wallet, how much have you earned?',
  requiresDatabase: true,
  get examples(){ return [this.name, ...this.aliases];},
  run: (client, message) => profile.findById(message.author.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    };

    if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.member.displayName}**, you don't have a wallet yet! To create one, type \`${client.prefix}register\`.`);
    };

    return message.channel.send(
      new MessageEmbed().setDescription(
        `\u200B\n💰 **${
          text.commatize(doc.data.economy.wallet)
        }** credits in posession.\n\n${
          doc.data.economy.bank !== null
          ? `💰 **${text.commatize(doc.data.economy.bank)}** credits in bank!`
          : `Seems like you don't have a bank yet. Create one now by typing \`${
            client.config.prefix
          }bank\``
        }`
      ).setAuthor(`${message.member.displayName}'s wallet`)
      .setColor('GREY')
      .setThumbnail(message.author.displayAvatarURL({dynamic: 'true'}))
      .setFooter(`Profile Balance | \©️${new Date().getFullYear()} Mai`)
    );
  })
};
