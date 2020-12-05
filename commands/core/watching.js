const { MessageEmbed, GuildEmoji } = require('discord.js');
const _ = require('lodash');
const watching = require('require-text')(`${process.cwd()}/assets/graphql/Watching.graphql`,require);
const list = require(`${process.cwd()}/models/GuildWatchlist`);
const Page = require(`${process.cwd()}/struct/Paginate`);
const text = require(`${process.cwd()}/util/string`);

module.exports = {
  name: 'watching',
  aliases: [ 'watchlist', 'list' ],
  guildOnly: true,
  cooldown: {
    time: 60000,
  },
  group: 'core',
  description: 'View list of anime this server is subscribed to.',
  clientPermissions: [ 'EMBED_LINKS' ],
  get examples(){ return [ this.name, ...this.aliases ]},
  run: async (client, message) => {

    const id = client.guildProfiles.get(message.guild.id).anischedChannel;
    const guildID = message.guild.id;
    const embed = new MessageEmbed()
    .setColor('RED')
    .setFooter(`Anischedule Watchlist | \©️${new Date().getFullYear()} Mai`)

    if (!id){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, This server's anischedule feature has been disabled.`);
    };

    let profile = await list.findOne({ guildID }).catch(err => null) ||
    await new list({ guildID }).save().catch(err => err);

    if (!profile || !(profile instanceof list)){
      return message.channel.send(
        embed.setAuthor('Database Not Found', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription(`Couldn't contact database provider. Please try again later.`)
      );
    };

    if (!profile.data.length){
      return message.channel.send(
        embed.setAuthor('No Subscription','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription(`**${message.member.displayName}**, this server has no anischedule entries yet.`)
      )
    };

    const entries = [];
    const watched = profile.data;
    let page = 0
    let hasNextPage = false;

    do {
      const res = await client.anischedule.fetch(watching, {watched, page});

      if (res.errors){
        return message.channel.send(
          embed.setAuthor('AniList Error', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
          .setDescription('Received error from anilist:\n' + errors.map(x => x.message).join('\n'))
        );
      };

      if (!entries.length && !res.data.Page.media.length){
        return message.channel.send(
          embed.setAuthor('No Subscription','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
          .setDescription(`**${message.member.displayName}**, this server has no anischedule entries yet.`)
        )
      };

      page = res.data.Page.pageInfo.currentPage + 1;
      hasNextPage = res.data.Page.pageInfo.hasNextPage;
      entries.push(...res.data.Page.media.filter(x => x.status === 'RELEASING'));
    } while (hasNextPage);

    const descriptions = _.chunk(entries.sort((A,B) => A.id - B.id).map( entry => {
      return `•\u2000\u2000\`[ ${' '.repeat(6 - (entry.id).toString().length)}${entry.id} ]\` **[${text.truncate(entry.title.romaji, 42, '...')}](${entry.siteUrl})**`
    }), 20).map( description => description.join('\n'));

    const embeds = descriptions.map((d,i) =>
      new MessageEmbed()
      .setColor('GREY')
      .setFooter([
        `Anischedule Watchlist`,
        `Page ${i + 1} of ${descriptions.length}`,
        `\©️${new Date().getFullYear()} Mai`
      ].join('\u2000\u2000•\u2000\u2000'))
      .setTitle(`Current Anischedule Subscription (${entries.length} entries!)`)
      .setDescription(d)
      .addField('Tips', [
        `- Use [\`${client.prefix}watch\`](https://mai-san.ml/docs/Features/Anischedule#adding-more-to-the-list) to add subscription`,
        `- Use [\`${client.prefix}unwatch\`](https://mai-san.ml/docs/Features/Anischedule#removing-anime-from-the-list) to remove subscription`,
        `- Use \`${client.prefix}nextep <anime title>\` to check episode countdown`
      ].join('\n'))
    );

    const pages = new Page(embeds);

    const msg = await message.channel.send(pages.firstPage);

    if (pages.size === 1){
      return;
    };

    const prev = client.emojis.cache.get('767062237722050561') || '◀';
    const next = client.emojis.cache.get('767062244034084865') || '▶';
    const terminate = client.emojis.cache.get('767062250279927818') || '❌';

    const filter = (_, user) => user.id === message.author.id;
    const collector = msg.createReactionCollector(filter);
    const navigators = [ prev, next, terminate ];
    let timeout = setTimeout(()=> collector.stop(), 90000);

    for (let i = 0; i < navigators.length; i++) {
      await msg.react(navigators[i]);
    };

    collector.on('collect', async reaction => {

      switch(reaction.emoji.name){
        case prev instanceof GuildEmoji ? prev.name : prev:
          msg.edit(pages.previous());
        break;
        case next instanceof GuildEmoji ? next.name : next:
          msg.edit(pages.next());
        break;
        case terminate instanceof GuildEmoji ? terminate.name : terminate:
          collector.stop();
        break;
      };

      await reaction.users.remove(message.author.id);
      timeout.refresh();
    });

  collector.on('end', async () => await msg.reactions.removeAll());

  return;
  }
};
