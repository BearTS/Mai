const _ = require('lodash');
const { MessageEmbed, GuildEmoji } = require('discord.js');
const Pages = require('../../struct/Paginate');
const market = require('../../assets/json/market.json');
const text = require('../../util/string');

module.exports = {
  name: 'market',
  aliases: [],
  rankcommand: true,
  clientPermissions: [ 'MANAGE_MESSAGES' ],
  group: 'social',
  description: 'Check what you can buy from the shop.',
  requiresDatabase: true,
  examples: [
    'market'
  ],
  run: async (client, message, [type] ) => {

    let selected = market.filter(x => x.type === type?.toLowerCase());

    if (!selected.length){
      selected = market;
    };

    const pages = new Pages(_.chunk(selected, 24).map((chunk, i, o) => {
      return new MessageEmbed()
      .setColor('GREY')
      .setTitle('Mai\'s Market')
      .setDescription('You can view all of the items in the market at once on https://market.mai-san.ml/')
      .setFooter(`Market | \©️${new Date().getFullYear()} Mai\u2000\u2000•\u2000\u2000Page ${i+1} of ${o.length}`)
      .addFields(...chunk.map(item => {
        return {
          inline: true,
          name: `\`[${item.id}]\` ${item.name}`,
          value: [
            item.description,
            `Type: *${item.type}*`,
            `Price: *${text.commatize(item.price)}*`,
            `Check Preview : \`${client.prefix}previewitem ${item.id}\``,
            `Purchase: \`${client.prefix}buy ${item.id} [amount]\``
          ].join('\n')
        };
      }));
    }));

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
  }
};
