const html2md = require('html2markdown');
const { MessageEmbed } = require('discord.js');
const { decode } = require('he');
const fetch = require('node-fetch');
const text = require('../../util/string');

module.exports = {
  name: 'steam',
  aliases: [],
  cooldown: {
    time: 10000,
    message: 'Accessing Steam has been rate limited to 1 use per user per 10 seconds'
  },
  group: 'utility',
  description: 'Searches <:steam:767062357952167946> [Steam](https://store.steampowered.com/ \'Steam Homepage\') for games!, or Doki-doki literature club, if no query is provided.',
  parameters: [ 'Search Query' ],
  examples: [
    'steam dota2',
    'steam'
  ],
  run: async (client, message, args) => {

    const query = args.join(' ') || 'Doki Doki Literature Club';

    const res = await fetch(`https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=${encodeURI(query)}`)
    .then(res => res.json())
    .catch(() => null);

    if (!res || !res.total){
      return message.channel.send(`\\❌ Could not find **${query}** on <:steam:767062357952167946> steam`);
    };

    const body = await fetch (`https://store.steampowered.com/api/appdetails/?cc=us&l=en&appids=${res.items[0].id}`)
    .then(res => res.json())
    .catch(() => null);

    if (!body){
      return message.channel.send(`\\❌ Could not find **${query}** on <:steam:767062357952167946> steam`);
    };

    const data = body[res.items[0].id].data;
    const platformLogo = { windows: '<:windows:767062364042166321>' , mac: '<:mac:767062376440659978>', linux: '<:linux:767062376440659978>' };
    const platformrequirements = { windows: 'pc_requirements', mac: 'mac_requirements', linux: 'linux_requirements' };
    const current = (data.price_overview?.final || 'Free').toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const original = (data.price_overview?.initial || 'Free').toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const price = current === original ? current : `~~~${original}~~~ ${current}`;
    const platforms = Object.entries(data.platforms).filter(([platform, has]) => has)
    .map(([platform]) => { return {
      name: '\u200b', inline: true,
      value: `${platformLogo[platform]} ${decode(html2md(data[platformrequirements[platform]].minimum)).split('* **Additional Notes:')[0]}`
    }});
    platforms[0].name = 'System Requirements';

    return message.channel.send(
      new MessageEmbed()
      .setColor(0x101D2F)
      .setTitle(data.name)
      .setImage(res.items[0].tiny_image)
      .setURL(`https://store.steampowered.com/app/${data.steam_appid}`)
      .setFooter(`Steam @ Steam.Inc©️  | \©️${new Date().getFullYear()} Mai`)
      .addFields([
        { name: 'Price', value: `•\u2000 ${price}`, inline: true },
        { name: 'Metascore', value: `•\u2000 ${data.metacritic?.score||'???'}`, inline: true },
        { name: 'Release Date', value: `•\u2000 ${data.release_date?.data||'???'}`, inline: true },
        { name: 'Developers', value: data.developers.map(m => `• ${m}`).join('\n'), inline: true },
        { name: 'Categories', value: data.categories.map(m => `• ${m.description}`).join('\n'), inline: true },
        { name: 'Genres', value: data.genres.map(m => `• ${m.description}`).join('\n'), inline: true },
        { name: '\u200b', value: text.truncate(decode(data.detailed_description.replace(/(<([^>]+)>)/ig,' ')),980)},
        { name: 'Supported Languages', value: `\u2000${text.truncate(html2md(data.supported_languages), 997)}`},
        ...platforms
      ])
    );
  }
};
