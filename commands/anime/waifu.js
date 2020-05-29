const WL = require('public-waifulist')
const wl = new WL()
const { MessageEmbed } = require('discord.js')
const { textTrunctuate } = require('../../helper')
const { pointright, pointleft, cancel } = require('../../emojis')

module.exports = {
  config: {
    name: 'waifu',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: {
      time: 30,
      msg: 'Oops! You are going to fast! Please slow down to avoid being rate-limited!'
    },
    group: 'anime',
    description: 'Generate a random waifu.',
    examples: ['waifu'],
    parameters: []
  },
  run: async (client, message, args) => {

    let msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\n• • • Generating Waifu • • •\n\u200B`).setThumbnail('https://i.imgur.com/u6ROwvK.gif'))

    const { name: { english, kana }, description, rank, url, image, origin, gallery } = await fetchWaifu()

    let counter = 0

    const embedify = () => {
      return new MessageEmbed()
      .setAuthor(`${english}${kana && kana.length ? ` • ${kana}` : ''}`,image, url)
      .setDescription(`${origin}\n#${rank}\n\n\n${gallery.length ? `[Download This Image](${gallery[counter].download} 'Click to Download this image!')` : ''}`)
      .setImage(gallery.length ? gallery[counter].thumbnail : image)
      .setFooter(gallery.length > 1 ? `Gallery page no ${counter + 1} of ${gallery.length}` : '')
      .setTimestamp()
      .setColor('GREY')
    }

    try {
      msg.edit(embedify())
    } catch (err) {
      msg = await message.channel.send(embedify())
    }

    if (gallery.length < 2) return msg.react('💖')

    const left = pointleft(client)
    const right = pointright(client)
    const terminate = cancel(client)
    const collector = msg.createReactionCollector( (reaction, user) => user.id === message.author.id)
    const navigators = [ left, right, terminate ]

    for (let i = 0; i < navigators.length; i++) await msg.react(navigators[i])
    let timeout = setTimeout(()=> collector.stop('timeout'), 180000)

    collector.on('collect', async ( { emoji: { name }, users } ) => {
      switch (name) {
        case left.name ? left.name : left:
          if (counter < 1) counter = gallery.length
          clearTimeout(timeout)
          counter--
          await msg.edit(embedify())
        break
        case right.name ? right.name : right:
          if (counter === gallery.length - 1) counter = -1
          clearTimeout(timeout)
          counter++
          await msg.edit(embedify())
        break
        case terminate.name ? terminate.name : terminate:
          collector.stop('terminated')
        break
      }

      await users.remove(message.author.id)

      timeout = setTimeout(() => collector.stop('timeout'), 60000)

    })

    collector.on('end', async () => {

      await msg.reactions.removeAll()
      msg.react('💖')
    })
  }
}

async function fetchWaifu(){
  const random = await wl.getRandom()
  if (!random) return await fetchWaifu()

  const { data: { id, name, original_name, display_picture, description, popularity_rank, husbando, url, series } } = random
  if (husbando) return await fetchWaifu()

  res = {
    name: {
      english: name,
      kana: original_name
    },
    description: description,
    rank: popularity_rank,
    url: url,
    image: display_picture,
    origin: series.name,
    gallery: []
  }

  const { data } = await wl.getCharacterGallery(id)
  if (!data) return res
  data.filter( ( { path } ) => path.split('.').pop()==='jpeg').forEach( ( { path, thumbnail } ) => res.gallery.push({download:path, thumbnail:thumbnail}))

  return res

}
