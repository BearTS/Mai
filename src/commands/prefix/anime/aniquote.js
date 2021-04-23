const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const { randomQuote }                         = require('animequotes');
const { searchAnime }                         = require('node-kitsu');

module.exports = {
  name             : 'aniquote',
  aliases          : [ 'aq', 'animequote' ],
  cooldown         : null,
  guildOnly        : true,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  group            : 'anime',
  description      : 'Generate a random anime quote.',
  parameters       : [],
  examples         : [ 'aniquote', 'aq', 'animequote' ],
  run              : async (message, language) => {

    const { quote, anime, id, name } = randomQuote();

    const parameters = new language.Parameter({ '%ANIME%': anime, '%QUOTE%': quote, '%NAME%': name });
    const res        = await searchAnime(anime,0).catch(()=>{}) || [];
    const image      = res?.[0]?.attributes?.coverImage?.original || null;
    const field      = language.get({ '$in': 'COMMANDS', id: 'ANIQUOTE_EFIEL', parameters });
    const footer     = language.get({ '$in': 'COMMANDS', id: 'ANIQUOTE_EFOOT' });

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY').setDescription(field).setImage(image).setTimestamp()
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
    );
  }
};
