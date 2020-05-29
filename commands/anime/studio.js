const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const q = `query($search:String){ Studio(search:$search sort:SEARCH_MATCH){ isAnimationStudio id name siteUrl media(sort: POPULARITY isMain: true page: 1 perPage: 50){ nodes{ title { romaji english native } siteUrl format episodes duration } } } }`

module.exports = {
  config: {
    name: 'studio',
    aliases: [],
    guildOnly: false,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: {
      time: 10,
      msg: 'Oops! You are going to fast! Please slow down to avoid being rate-limited!'
    },
    group: 'anime',
    description: 'Search for Studio\'s on your favorite anime!',
    examples: ['studio Madhouse','studio Kyoto Animation'],
    parameters: ['search query']
  },
  run: async (client, message, args ) => {

    if (!args.length) args = [ 'Cloverworks' ]

    const msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nSearching for studio **${args.join(' ')}** from Anilist.\n\u200B`).setThumbnail('https://i.imgur.com/u6ROwvK.gif'))

    let { errors, data } = await query( q , { search: args.join(' ') })

    if (errors && errors.length) try {
      return msg.edit(error(`An unexpected error has occured!\n\n\`\`\`fix\n[${errors[0].status}] : ${errors[0].message}\n\`\`\``))
    } catch (err) {
      return message.channel.send(error(`An unexpected error has occured!\n\n\`\`\`fix\n[${errors[0].status}] : ${errors[0].message}\n\`\`\``))
    }

    const elapsed = new Date() - msg.createdAt

    const { Studio: { isAnimationStudio, id, name, siteUrl, media: { nodes } } } = data

    const TV = await hyperlinkify(nodes.filter( f => f.format === 'TV'))
    const MOVIE = await hyperlinkify(nodes.filter( f => f.format === 'MOVIE'))
    const OVA = await hyperlinkify(nodes.filter( f => f.format === 'ONA'))

    const embed = new MessageEmbed()
    .setAuthor(name, null, siteUrl)
    .addField(`TV Series`, TV)
    .addField(`Movies`, MOVIE)
    .addField(`Original Video Animation (OVA)`,OVA)
    .setColor('GREY')
    .setFooter(`Anilist.co • Search duration ${(elapsed / 1000).toFixed(2)} seconds`)


    try {
      msg.edit(embed)
    } catch (err) {
      message.channel.send(embed)
    }

  }
}


function query(query,variables){
  return fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  }).then(res => res.json())
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

async function hyperlinkify(arr){
  if (!arr.length) return `None Found`

  let res = ''

  arr.forEach( ({ title: { romaji }, siteUrl }) => {
    let toAdd = ` • [${romaji}](${siteUrl})`
    if (res.length + toAdd.length > 1000) {
      return
    }
    res += toAdd
   })

  return res

}
