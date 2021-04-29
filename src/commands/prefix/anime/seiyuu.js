const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const moment = require('moment');

module.exports = {
  name             : 'seiyuu',
  aliases          : [ 'voice' , 'va' ],
  cooldown         : { time: 1e4 },
  guildOnly        : false,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  group            : 'anime',
  description      : 'Search for seiyuu\'s on your favorite anime characters, or Mai\'s seiyuu if no query is provided!',
  parameters       : [ 'Search Query' ],
  examples         : [ 'seiyuu', 'voice amamiya sora', 'va yuuki kaji'],
  run              : async (message, language, args) => {

    const query = args.join(' ') || 'Asami Seto';
    const parameters = new language.Parameter({
      '%AUTHOR%': message.author.tag,
      '%QUERY%': query
    });

    message.channel.startTyping();

    const { data, errors } = await message.client.anischedule.fetch(message.client.services.GRAPHQL.Seiyuu, { search: query });

    message.channel.stopTyping();

    if (errors){
      parameters.assign({ '%QUERY%': query, '%SERVICE%': 'AniList', '%ERROR%': errors[0].message });
      return message.reply(language.get({ '$in': 'ERRORS', id: errors[0].status, parameters }));
    };

    const { STRING, ARRAY } = message.client.services.UTIL;

    const footer = language.get({ '$in': 'COMMANDS', id: 'SEIYUU_FOOTER' });
    const flag   = message.client.anischedule.info.langflags.find(x => x.lang.toLowerCase() === data.Staff.language?.toLowerCase())?.flag || '';
    const desc   = STRING.truncate((data.Staff.description||'').replace(/&#?[a-z0-9]+;|<([^>]+)>/ig,''), 1000, `...[Read More](${data.Staff.siteUrl})`);
    const chars  = ARRAY.joinAndLimit(data.Staff.characters.nodes.map(x => `[${x.name.full}](${x.siteUrl.split('/').slice(0,5).join('/')})`), 1000, ' • ').text || DICT['NONE FOUND'];
    const staffs = ARRAY.joinAndLimit(data.Staff.staffMedia.nodes.map(s => `[${s.title.romaji}](${s.siteUrl.split('/').slice(0,5).join('/')})`), 1000, ' • ').text || DICT['NONE FOUND'];

    parameters.assign({ '%SEIYUU_NAME%': data.Staff.name.full });
    const voiced = language.get({ '$in': 'COMMANDS', id: 'SEIYUU_VOICED', parameters });
    const staff  = language.get({ '$in': 'COMMANDS', id: 'SEIYUU_STAFF', parameters });

    return message.channel.send(
      new MessageEmbed()
      .setColor(0xe620a4)
      .setDescription(flag + '\n' + desc)
      .setThumbnail(data.Staff.image.large)
      .setAuthor(Object.values(data.Staff.name).filter(Boolean).join('\u2000•\u2000'), null, data.Staff.siteUrl)
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      .addFields([ { name: voiced, value: chars  }, { name: staff,  value: staffs } ])
    );
  }
};
