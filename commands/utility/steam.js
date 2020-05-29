const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  config: {
    name: "steam",
    aliases: ['game','gaben'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown:{
      time: 10,
      msg: "Accessing Steam has been rate limited to 1 use per user per 10 seconds"
    },
    group: "utility",
    description: "Searches steam for games!",
    examples: ["steam [game title]"],
    parameters: ['query']
  },
  run: async (client, message, args) => {
  
    const query = !args.length ? 'Doki Doki Literature Club' : args.join(' ')

    const res = await fetch(`https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=${encodeURI(query)}`).then(res => res.json()).catch(()=>{})

    if (!res) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('The SteamAPI did not respond. Please report this to the bot owner. The API might be down or there might be changes on the API itself.'))

    if (!res.total) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`\u200B\n\nNo results found for **${args.join(' ')}**!`).setThumbnail('https://files.catbox.moe/zd5krc.png') )

    const body = await fetch(`https://store.steampowered.com/api/appdetails/?appids=${res.items[0].id}`).then(res => res.json()).catch(()=>{})

    if (!body ) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('The SteamAPI did not respond. Please report this to the bot owner. The API might be down or there might be changes on the API itself.'))

    const { data } = body[res.items[0].id.toString()]
    const current = data.price_overview ? `$${roundTo(data.price_overview.final / 100 / 50.63,2)}` : 'Free';
    const original = data.price_overview ? `$${roundTo(data.price_overview.initial / 100 / 50.63,2)}` : 'Free';
    const price = current === original ? current : `~~${original}~~ ${current}`;
    const platforms = [];
    if (data.platforms) {
      if (data.platforms.windows) platforms.push('Windows');
      if (data.platforms.mac) platforms.push('Mac');
      if (data.platforms.linux) platforms.push('Linux');
    }

    message.channel.send( new MessageEmbed()
    .setColor(0x101D2F)
    .setAuthor('Steam', 'https://i.imgur.com/xxr2UBZ.png', 'http://store.steampowered.com/')
    .setTitle(data.name)
    .setURL(`http://store.steampowered.com/app/${data.steam_appid}`)
    .setImage(res.items[0].tiny_image)
    .addField('Price', `•\u2000 ${price}`, true)
    .addField('Metascore', `•\u2000 ${data.metacritic ? data.metacritic.score : '???'}`, true)
    .addField('Recommendations', `•\u2000 ${data.recommendations ? data.recommendations.total : '???'}`, true)
    .addField('Platforms', `•\u2000 ${platforms.join(', ') || 'None'}`, true)
    .addField('Release Date', `•\u2000 ${data.release_date ? data.release_date.date : '???'}`, true)
    .addField('DLC Count', `•\u2000 ${data.dlc ? data.dlc.length : 0}`, true)
    .addField('Developers', `•\u2000 ${data.developers ? data.developers.join(', ') || '???' : '???'}`, true)
    .addField('Publishers', `•\u2000 ${data.publishers ? data.publishers.join(', ') || '???' : '???'}`, true)
    .addField('\u200B','\u200B',true)
    )
  }
}

function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {
        n = (n * -1).toFixed(2);
    }
    return n;
}
