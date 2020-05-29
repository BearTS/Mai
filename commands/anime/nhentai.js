const { MessageEmbed } = require('discord.js')
const { randomQuote } = require('animequotes')
const { API } = require('nhentai-api')
const api = new API()

module.exports = {
  config: {
    name: "nhentai",
    aliases: ['gimmesauce','sauce','hentai'],
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
  	description: 'Fetch doujin information from [nHentai](https://nhentai.net "nHentai Homepage")',
  	examples: ['nhentai 263492','nhentai 166258'],
  	parameters: ['Media ID']
  },
  run: async ( client, message, [ id ] ) => {

    if (!message.channel.nsfw) {
      client.cooldowns.get('nhentai').delete(message.author.id,30 * 1000)
      return message.channel.send(error('Please move to a nsfw channel to continue using this command.'))

    }

    if (!id || isNaN(id)) {

      client.cooldowns.get('nhentai').delete(message.author.id,30 * 1000)
      return message.channel.send(error('Please provide a valid **sauce**.'))

    }

    id = Number(id)

    let msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nSearching for hentai with id **${id}** on MAL.\n\u200B`).setThumbnail('https://i.imgur.com/u6ROwvK.gif'))

    const book = await api.getBook(id).catch(()=>{})

    if (!book) try {
      return msg.edit(error(`Couldn\'t find a doujin with **sauce ${id}**.`))
    } catch (err) {
      return message.channel.send(error(`Couldn\'t find a doujin with **sauce ${id}**.`))
    }

    const { title: { english, japanese, pretty }, tags, pages, uploaded } = book

    const cover = api.getImageURL(book.cover)

    const embed =   new MessageEmbed()
      .setAuthor(pretty, null, 'https://nhentai.net/g/'+id)
      .setDescription(`
        **${english}**
        *${japanese}*
        `)
      .addField('TAGS',tags.map( m => m.name ).sort().join(', '))
      .addField('PAGES', pages.length)
      .setTimestamp(uploaded)
      .setThumbnail(cover)
      .setColor('RED')

      try {
        return msg.edit(embed)
      } catch (err) {
        return message.channel.send(embed)
      }
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
