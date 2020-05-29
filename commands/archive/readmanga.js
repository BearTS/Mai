//ISSUE: CANNOT RENDER IMAGE ON DISCORD> IMAGE SIZE TOO LARGE

const { getChapter, getSeries } = require('poketo')
const { pointright, pointleft, cancel } = require('../../emojis')
const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "readmanga",
    aliases: ["rm"],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'anime',
  	description: 'Read manga from [MangaDex](https://mangadex.org "MangaDex Homepage") without those pesky ads',
  	examples: ['readmanga 263492','readmanga 166258'],
  	parameters: ['Media ID']
  },
  run: async ( client , message, [ url ] ) => {

    let status = client.read.get(message.author.id)

    if (status) return message.channel.send(error(`You have still have an open book, [Click here](${status.link}) to continue reading`))

    if (!url || !url.length || !url.startsWith('https://mangadex.org/')) return message.channel.send(error(`Please specify a valid [MangaDex](https://mangadex.org 'Click here and grab a manga chapter page to start reading') url.`))

    if (!url.startsWith('https://mangadex.org/chapter')) return message.channel.send(error(`The page doesn't seem to contain any images. URL must start with https://mangadex.org/chapter`))

    const res = await getChapter(url).catch(()=>{})

    if (!res) return message.channel.send(error('Manga Not found!'))

    const { pages } = res

    const image = []
    pages.forEach( page => image.push( page.url ))
    let counter = 0

    console.log(image)

    const embedify = () => {
      return new MessageEmbed()
      .setAuthor('Read Manga from Discord', null, url )
      .setImage(image[counter])
      .setColor('GREY')
      .setFooter(`Page ${counter + 1} of ${image.length}`)
    }

    const msg = await message.channel.send(embedify())
    status = client.read.set(message.author.id,{ link: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${msg.id}`}).get(message.author.id)

    const left = pointleft(client)
    const right = pointright(client)
    const terminate = cancel(client)
    const collector = msg.createReactionCollector( (reaction, user) => user.id === message.author.id)
    const navigators = [ left, right, terminate ]

    for (let i = 0; i < navigators.length; i++) await msg.react(navigators[i])

    let timeout = setTimeout(()=> collector.stop('timeout'), 180000)
    let n = 0

    collector.on('collect', async ( { emoji: { name } , users } ) => {

      switch(name){
        case left.name ? left.name : left:
          if (counter < 1) counter = image.length
          clearTimeout(timeout)
          counter--
          await msg.edit(embedify())
        break;
        case right.name ? right.name : right:
          if (counter === image.length - 1) counter = -1
          clearTimeout(timeout)
          counter++
          await msg.edit(embedify())
        break;
        case terminate.name ? terminate.name : terminate:
          collector.stop('terminated')
        break;
      }

      await users.remove(message.author.id)

      timeout = setTimeout(() => collector.stop('timeout'), 180000)

    })

    collector.on('end', () => {

      client.read.delete(message.author.id)
      msg.reactions.removeAll()

    })
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
