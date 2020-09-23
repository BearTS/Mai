const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const html2md = require('html2markdown')
const { decode } = require('he')
const { TextHelpers: { textTrunctuate }} = require('../../helper')

module.exports = {
  name: 'steam',
  aliases: [],
  cooldown:{
    time: 10000,
    message: "Accessing Steam has been rate limited to 1 use per user per 10 seconds"
  },
  group: "utility",
  description: "Searches <:steam:726304530228183100> [Steam](https://store.steampowered.com/ 'Steam Homepage') for games!",
  examples: ["steam [game title]"],
  parameters: ['query'],
  run: async (client, message, args) => {

    const query = !args.length
                  ? 'Doki Doki Literature Club'
                  : args.join(' ')

    const res = await fetch(`https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=${encodeURI(query)}`)
                  .then(res => res.json())
                    .catch(()=>null)

    if (!res
      || !res.items
      || !res.items.length
      || !res.total)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Could not find **${query}** on <:steam:726304530228183100> Steam.`)

    const body = await fetch(`https://store.steampowered.com/api/appdetails/?appids=${res.items[0].id}`)
                  .then(res => res.json())
                    .catch(()=>null)

    if (!body) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Could not find **${query}** on <:steam:726304530228183100> Steam.`)

    const { data } = body[res.items[0].id]

    const current = data.price_overview
                    ? `$${(data.price_overview.final / 100).toFixed(2)}`
                    : 'Free'

    const original = data.price_overview
                    ? `$${(data.price_overview.initial / 100).toFixed(2)}`
                    : 'Free';

    const price = current === original
                  ? current
                  : `~~${original}~~ ${current}`;

    const platformLogo = {
        windows: '<:windows:726323689238560779>'
      , mac: '<:mac:726323946206527499>'
      , linux: '<:linux:726324195440721930>'
    }

    const platformrequirements = {
        windows: 'pc_requirements'
      , mac: 'mac_requirements'
      , linux: 'linux_requirements'
    }

    const platforms = data.platforms
                      ? Object.entries(data.platforms)
                        .filter( ([platform, bool]) => bool)
                          .map( ([platform]) => {
                            return {
                              name: '\u200b'
                            , inline: true
                            , value: `${platformLogo[platform]} ${html2md(data[platformrequirements[platform]].minimum).split('* **Additional Notes:')[0]}`
                          }
                        })
                      : []

    platforms[0].name = 'System Requirements'

    return message.channel.send( new MessageEmbed()

    .setColor(0x101D2F)

    .setAuthor(
        'Steam'
      , 'https://i.imgur.com/xxr2UBZ.png'
      , 'http://store.steampowered.com/'
    )

    .setTitle(data.name)

    .setURL(`http://store.steampowered.com/app/${data.steam_appid}`)

    .setImage(res.items[0].tiny_image)

    .addField(
        'Price'
      , `•\u2000 ${price}`
      , true
    )

    .addField(
        'Metascore'
      , `•\u2000 ${
          data.metacritic
          ? data.metacritic.score
          : '???'
        }`
      , true
    )

    .addField(
        'Release Date'
      , `•\u2000 ${
          data.release_date
          ? data.release_date.date
          : '???'
        }`
      , true
    )

    .addField(
        'Developers'
      , data.developers.map( m => '• ' + m ).join('\n')
      , true
    )

    .addField(
        'Categories'
      , data.categories.map( m => '• ' + m.description).join('\n')
      , true
    )

    .addField(
        'Genres'
      , data.genres.map( m => '• ' + m.description).join('\n')
      , true
    )

    .addField(
        '\u200b'
      , textTrunctuate(decode(data.detailed_description.replace(/(<([^>]+)>)/ig,' ')),980)
    )

    .addField(
        'Supported Languages'
      , `•\u2000 ${textTrunctuate(html2md(data.supported_languages),997)}`
    )

    .addFields(platforms)

    .setFooter(`©️ Steam.Inc • http://store.steampowered.com/app/${data.steam_appid}`)
    )
  }
}
