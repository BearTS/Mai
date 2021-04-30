const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const { join } = require('path');
const waifuDBL = require(join(__dirname, '../../../assets/json/waifulist.json'));

module.exports = {
  name             : 'waifu',
  aliases          : [],
  cooldown         : null,
  guildOnly        : false,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.ATTACH_FILES, FLAGS.READ_MESSAGE_HISTORY ],
  group            : 'anime',
  description      : 'Generates random waifu!',
  parameters       : [ ],
  examples         : [ 'waifu' ],
  run              : async (message, language) => {

    const waifu  = waifuDBL[Math.floor(Math.random() * (waifuDBL.length))];
    const image  = Math.floor(Math.random() * waifu.images.length);
    const DICT   = language.getDictionary([ 'waifu', 'likeability' ]);
    const maths  = (100 * (((1 - waifu.statistics.hate / (waifu.statistics.love + waifu.statistics.fav)) * 0.6) + ((waifu.statistics.upvote / (waifu.statistics.upvote + waifu.statistics.downvote)) * 0.4))).toFixed(2);
    const STRING = message.client.services.UTIL.STRING;

    const embed = new MessageEmbed()
    .setColor(0xe620a4)
    .setAuthor(STRING.truncate([ waifu.names.en, waifu.names.jp, waifu.names.alt ].filter(Boolean).join('\n'), 200), waifu.avatar || null)
    .setDescription([ waifu.from.name, waifu.from.type].filter(Boolean).map(x => `*${x}*`).join('\n'))
    .setImage(waifu.images[image])
    .setFooter(`❣️${maths} ${DICT.LIKEABILITY}\u2000|\u2000${DICT.WAIFU}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`);

    return message.channel.send(embed).then(async m => {
      await m.react('💖');

      return; // remove this line when done editing.

      // if (message.channel.nsfw === true) return;
      // await m.react('🔞');
      // const filter    = (r,u) => message.author.id === u.id && r.emoji.name === '🔞';
      // const options   = { time: 6e4 };
      // const collector = m.createReactionCollector(filter, options);
      //
      // collector.once('collect', (_,O) => collector.stop('x'))
      //          .once('end'    , (O,_) => {_ === 'x' ? doTheThing() : null; console.log(_)});
      //
      // function doTheThing(){
      //   m.edit(embed.setImage(null).addField(`REMOVED`, 'This image has been flagged as nsfw.\nThis might still appear on some places.'));
      //   message.client.users.fetch(message.client.owners[0]).then(owner => {
      //     owner.send(`**${message.author.tag}** flagged ${waifu.images[image]} as nsfw. Waifu ID is \`${waifu.id}\`, image index is \`${image}\``);
      //     message.author.cooldown.set('waifu', Date.now() + 5000)
      //   });
      // };
      //
      // return;
    });
  }
};
