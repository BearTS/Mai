const _ = require('lodash');
const { MessageEmbed } = require('discord.js');
const profile = require('../../models/Profile');
const Pages = require('../../struct/Paginate');
const market = require('../../assets/json/market.json');

module.exports = {
  name: 'inventory',
  aliases: [ 'inv' ],
  rankcommand: true,
  clientPermissions: [ 'MANAGE_MESSAGES' ],
  group: 'social',
  description: 'Check your items.',
  requiresDatabase: true,
  examples: [
    'inventory',
    'inv'
  ],
  run: async (client, message ) => profile.findById(message.author.id, async (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new profile({ _id: message.author.id });
    };

    const pages = new Pages(_.chunk(doc.data.profile.inventory, 25).map((chunk, i, o) => {
      return new MessageEmbed()
      .setColor('GREY')
      .setTitle(`${message.author.tag}'s Inventory`)
      .setDescription('[ WIP ]')
      .setFooter(`Market | \©️${new Date().getFullYear()} Mai\u2000\u2000•\u2000\u2000Page ${i+1} of ${o.length}`)
      .addFields(...chunk.sort((A,B) => A.id - B.id ).map(d => {
        const item = market.find(x => x.id == d.id);
        return {
          inline: true,
          name: `\`[${item.id}]\` x${d.amount} ${item.name}`,
          value: [
            `Type: *${item.type}*`,
            `Selling Price: *${Math.floor(item.price * 0.7)}*`,
            `Use: \`${client.prefix}use ${item.id}\``,
            `Sell: \`${client.prefix}sell ${item.id} [amount]\``
          ].join('\n')
        }
      }));
    }));

    if (!pages.size){
      return message.channel.send(`\\❌ **${message.author.tag}**, your inventory is empty.`);
    };

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

  })
};
