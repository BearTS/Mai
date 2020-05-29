const { MessageEmbed } = require('discord.js')
const { randomQuote } = require('animequotes')
const { API } = require('nhentai-api')
const { pointright, pointleft, cancel } = require('../../emojis')
const api = new API()

module.exports = {
  config: {
    name: "readhentai",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'anime',
  	description: 'Read Hentai from [nHentai](https://nhentai.net "nHentai Homepage")',
  	examples: ['readhentai 263492','readhentai 166258'],
  	parameters: ['Media ID']
  },
  run: async ( client, message, [id] ) => {

    if (!message.channel.nsfw) {
      client.cooldowns.get('readhentai').delete(message.author.id,120 * 1000)
      return message.channel.send(error('Please move to a nsfw channel to continue using this command.'))

    }

    let status = client.read.get(message.author.id)

    if (status) {

      return message.channel.send(error(`You have still have an open book, [Click here](${status.link}) to continue reading`))

    }

    if (!id || isNaN(id)) {

      client.cooldowns.get('readhentai').delete(message.author.id,120 * 1000)
      return message.channel.send(error('Please provide a valid **sauce**.'))

    }

    id = Number(id)

    const book = await api.getBook(id).catch(()=>{})

    if (!book) return message.channel.send(error(`Couldn\'t find a doujin with **sauce ${id}**.`))

    const { title: { english, japanese, pretty }, tags, pages, uploaded } = book

    const cover = api.getImageURL(book.cover)
    const image = []
    pages.forEach( page => image.push(api.getImageURL(page)))
    let counter = 0

    const embedify = () => {
      return new MessageEmbed()
      .setAuthor(pretty, null, 'https://nhentai.net/g/'+id)
      .setImage(image[counter])
      .setColor('RED')
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
