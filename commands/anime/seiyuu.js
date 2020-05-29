const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const q = `query($search:String){ Staff(search:$search sort: SEARCH_MATCH) { id name { full native } language image { large } description siteUrl characters(page: 1, perPage: 20, sort: ROLE) { nodes { id name { full native } siteUrl } } staffMedia(page: 1, perPage: 20, sort: POPULARITY) { nodes { title { romaji english } siteUrl } } } }`
const { textTrunctuate } = require('../../helper')

module.exports = {
  config: {
    name: 'seiyuu',
    aliases: ['voice'],
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
    description: 'Search for seiyuu\'s on your favorite anime characters!',
    examples: ['seiyuu Takahashi Rie','voice Amamiya Sora'],
    parameters: ['search query']
  },
  run: async (client, message, args ) => {

    if (!args.length) args = [ 'Seto Asami' ]

    const msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nSearching for seiyuu **${args.join(' ')}** from Anilist.\n\u200B`).setThumbnail('https://i.imgur.com/u6ROwvK.gif'))

    let { errors, data } = await query( q , { search: args.join(' ') })

    if (errors && errors.length) try {
      return msg.edit(error(`An unexpected error has occured!\n\n\`\`\`fix\n[${errors[0].status}] : ${errors[0].message}\n\`\`\``))
    } catch (err) {
      return message.channel.send(error(`An unexpected error has occured!\n\n\`\`\`fix\n[${errors[0].status}] : ${errors[0].message}\n\`\`\``))
    }

    const elapsed = new Date() - msg.createdAt

    let { Staff: { name: { full, native }, language, image : { large }, description, siteUrl, characters, staffMedia } }= data

    const chara = await charahyperlink(characters.nodes)
    const staff = await hyperlinkify(staffMedia.nodes)

    const embed = new MessageEmbed()
    .setAuthor(`${full}${native ? ` • ${native}`:''}`, null, siteUrl)
    .setThumbnail(large)
    .setColor('GREY')
    .setDescription(`${language}\n\n${textTrunctuate(description, 1000, `...[Read More](${siteUrl})`)}`)
    .addField(`${full} voiced these characters`,chara)
    .addField(`${full} is part of the staff of these anime`, staff)
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

async function charahyperlink(arr){
  if (!arr.length) return `None Found`

  let res = ''

  arr.forEach( ({ name: { full }, siteUrl }) =>{
    let toAdd = ` • [${full}](${siteUrl})`
    if (res.length + toAdd.length > 1000) {
      return
    }
    res += toAdd
  })

  return res
}
