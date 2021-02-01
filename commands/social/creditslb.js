const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');
const profile = require('../../models/Profile');

module.exports = {
  name: 'creditslb',
  aliases: [ 'richlb', 'richleaderboard', 'creditsleaderboard' ],
  guildOnly: true,
  rankcommand: true,
  group: 'social',
  description: 'Shows the top credit earners for this server',
  requiresDatabase: true,
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'creditslb',
    'richlb'
  ],
  run: (client, message) => {

    const { exceptions, isActive } = client.guildProfiles.get(message.guild.id).xp;
    const embed = new MessageEmbed()
    .setFooter(`XP Leaderboard | \©️${new Date().getFullYear()} Mai`)
    .setThumbnail('https://i.imgur.com/qkBQB8V.png')
    .setColor('RED');

    if (!isActive){
      return message.channel.send(
        embed.setDescription([
          `**${message.member.displayName}**, XP is currently disabled in this server.\n`,
          `If you are the server Administrator, you may enable it by typing \`${client.config.prefix}xptoggle\`.`,
          `[Learn More](https://mai-san.ml/docs/features/XP_System) about Mai's XP System.`
        ].join('\n'))
        .setAuthor('XP Systems Disabled','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      );
    };

    if (exceptions.includes(message.channel.id)){
      return message.channel.send(
        embed.setDescription([
          `**${message.member.displayName}**, XP is currently disabled in this channel.\n`,
          `To see which channels are xp-disabled, use the command \`${client.config.prefix}nonxpchannels\``,
          `If you are the server Administrator, you may reenable it here by typing \`${client.config.prefix}xpenable #${message.channel.name}\``,
          `[Learn More](https://mai-san.ml/docs/features/XP_System) about Mai's XP System.`
        ].join('\n'))
        .setAuthor('Channel Blacklisted','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      );
    };

    return profile.find({ 'data.xp.id': message.guild.id }, async (err, docs) => {
      if (err) {
        return message.channel.send(
          embed.setAuthor('Database Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
          .setDescription('Mai\'s Database Provider responded with an error: ' + err.name)
        );
      };

      docs = docs.map(x => { return { id: x._id, wallet: x.data.economy.wallet, bank: x.data.economy.bank};})
      .sort((A,B) => ((B.wallet || 0) + (B.bank || 0)) - ((A.wallet || 0) + (A.bank || 0))) // Arrange by credits, descending.
      .filter(x => Boolean(x.wallet || 0 + x.bank || 0)); // Remove document where total credits is 0.

      console.log(docs)

      if (!docs.length){
        return message.channel.send(
          embed.setDescription([
            `**${message.member.displayName}**, No credit documents found.\n\n`,
            'Users in this server have not started earning credits yet!\n',
            '[Learn More](https://mai-san.ml/) about Mai\'s Economy System.'
          ].join('\n'))
          .setAuthor('No Credits','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        );
      };

      const members = await message.guild.members
      .fetch({ user: docs.slice(0,10).map(x => x.id) })
      .catch(() => null)

      return message.channel.send(
        new MessageEmbed()
        .setColor('GREY')
        .setFooter(`Credits Leaderboard | \©️${new Date().getFullYear()} Mai`)
        .setAuthor(`🏆 ${message.guild.name} Credits Leaderboard`, message.guild.iconURL({format: 'png', dynamic: true }) || null)
        .addField(`**${members.get(docs[0].id)?.displayName || '<Unknown User>'}** ranked the highest with **${text.commatize(docs[0].wallet + docs[0].bank)} **Credits!`,
        [
          '```properties',
          '╭═══════╤════════╤═════════╤════════════════════════════╮',
          '┃  Rank ┃ Wallet ┃    Bank ┃ User                       ┃',
          '╞═══════╪════════╪═════════╪════════════════════════════╡',
          docs.slice(0,10).map((u,i) => {
            const rank = String(i+1);
            return [
              '┃' + ' '.repeat(6-rank.length) + rank,
              ' '.repeat(6-text.compactNum(u.wallet).length) + text.compactNum(u.wallet),
              ' '.repeat(7-text.compactNum(u.bank).length) + text.compactNum(u.bank),
              members.get(u.id)?.user.tag || '<Unknown User>'
            ].join(' ┃ ')
          }).join('\n'),
          '╞═══════╪════════╪═════════╪════════════════════════════╡',
          docs.filter(x => x.id === message.author.id).map((u,i,a) => {
            const user = a.find(x => x.id === message.author.id);
            const rank = docs.findIndex(x => x.id === message.author.id) + 1;
            return [
              '┃' + ' '.repeat(6-text.ordinalize(rank).length) + text.ordinalize(rank),
              ' '.repeat(6-text.compactNum(u.wallet).length) + text.compactNum(u.wallet),
              ' '.repeat(7-text.compactNum(u.bank).length) + text.compactNum(u.bank),
              text.truncate('You (' + message.author.tag + ')', 26) + ' '.repeat(27-text.truncate('You (' + message.author.tag + ')', 26).length) + '┃'
            ].join(' ┃ ')
          }).join(''),
          '╰═══════╧════════╧═════════╧════════════════════════════╯',
          '```'
        ].join('\n'))
      );
    });
  }
};
