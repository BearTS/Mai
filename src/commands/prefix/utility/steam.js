const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const fetch      = require('node-fetch');

module.exports = {
  name             : 'steam',
  description      : 'Searches the steam store database for games! or Doki-doki literature club, if no query is provided.',
  aliases          : [ 'steamsearch' ],
  cooldown         : { time: 1e4 },
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
  examples         : [ 'steam disgaea', 'steam' ],
  run              : async (message, language, args) => {

    const query      = args.join(' ') || 'Doki Doki Literature Club';
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%QUERY%': query });
    let   URI        = `https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=${encodeURI(query)}`;
    let   response   = await fetch(URI).then(res => res.json()).catch(err => err);
    const footer     = language.get({ '$in': 'COMMANDS', id: 'STEAM_EFOOTER', parameters });

    if (response instanceof Error){
      parameters.assign({ '%ERROR%': response.toString() });
      return message.reply(language.get({ '$in': 'ERRORS', id: response.name, parameters }));
    };

    if (!response.items.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'STEAM_NO_HITS', parameters }));
    };

    URI      = `https://store.steampowered.com/api/appdetails/?cc=en&appids=${response.items[0].id}`;
    response = await fetch(URI).then(res => res.json()).catch(err => err);

    if (response instanceof Error){
      parameters.assign({ '%ERROR%': response.toString() });
      return message.reply(language.get({ '$in': 'ERRORS', id: response.name, parameters }));
    };

          response          = Object.values(response)[0].data;
    const DICT              = language.getDictionary([ 'read more', 'price', 'tags', 'platforms' ]);
    const { STRING, ARRAY } = message.client.services.UTIL;

    const { discount_percent, initial_formatted, final_formatted } = response.price_overview || {};

    const price     = response.is_free ? 'Free' : discount_percent ? `~~${initial_formatted}~~ ${final_formatted} (${discount_percent}% off!)` : final_formatted;
    const desc      = STRING.truncate(response.short_description.replace(/\&[a-z]{1,}\;/ig, ''), 500, ` [...${DICT['READ MORE']}]`);
    const image     = response.screenshots[Math.floor(Math.random() * response.screenshots.length)].path_thumbnail;
    const thumbnail = response.header_image;
    const tags      = ARRAY.join(response.genres.map(x => `[${x.description}](https://store.steampowered.com/genre/${encodeURIComponent(x.description)}/)`))
    const platforms = ARRAY.join(Object.entries(response.platforms).filter(([_,v]) => !!v).map(([k]) => k));


    return message.channel.send(
      new MessageEmbed()
      .setTitle(response.name)
      .setURL(response.website)
      .setImage(image)
      .setColor(0x101D2F)
      .setThumbnail(thumbnail)
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
      .addFields([
        { name: DICT.PRICE    , inline: true , value: price     },
        { name: DICT.PLATFORMS, inline: true , value: platforms },
        { name: DICT.TAGS     , inline: false, value: tags      },
        { name: '\u200b'      , inline: false, value: desc      }
      ])
    );
  }
}
