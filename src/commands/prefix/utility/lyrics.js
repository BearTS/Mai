const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
  name             : 'lyrics',
  description      : 'Searches for lyric info about a song from GeniuslLyrics, or Kimi no Sei, if no query are provided.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'utility',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Search Query' ],
  examples         : [  'lyrics kimi no sei', 'lyrics fukashigi no karte' ],
  run              : async (message, language, args) => {

    const query      = args.join(' ') || 'Kimi no Sei';
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%QUERY%': query });
    const URI        = `https://some-random-api.ml/lyrics?title=${encodeURI(query)}`;
    const response   = await fetch(URI).then(res => res.json()).catch(err => err);
    const footer     = language.get({ '$in': 'COMMANDS', id: 'LYRICS_EFOOTER', parameters });

    if (response instanceof Error){
      parameters.assign({ '%ERROR%': response.toString() });
      return message.reply(language.get({ '$in': 'ERRORS', id: response.name, parameters }));
    };

    if (response.error){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'LYRICS_NOTFOUND', parameters }));
    };

    const embed_footer = `${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`;
    const embedify     = (response) => {
      return new MessageEmbed()
        .setThumbnail(response.thumbnail.genius)
        .setURL(response.links.genius)
        .setAuthor(response.author)
        .setTitle(response.title)
        .setFooter(embed_footer)
        .setDescription('')
        .setColor(0xe620a4);
    };

    const { STRING, Paginate } = message.client.services.UTIL;
    let embed_chunks           = [ embedify(response) ];

    for (const line of response.lyrics.split('\n\n').filter(Boolean)){
      if (embed_chunks[embed_chunks.length - 1].description.length + line.length < 2000){
        embed_chunks[embed_chunks.length - 1].description += line + '\n\n';
      } else {
        embed_chunks.push(embedify(response).setDescription(STRING.truncate(line + '\n\n', 2000)));
      };
    };

    if (embed_chunks.length === 1){
      return message.channel.send(embed_chunks[0]);
    } else {
      return new message.client.services.UTIL.Paginate(embed_chunks, message, {
        previousbtn        : '767062237722050561',
        nextbtn            : '767062244034084865',
        stopbtn            : '767062250279927818',
        removeUserReactions: message.type === 'dm' ? false : true,
        appendPageInfo     :  true
      }).exec();
    };
  }
};
