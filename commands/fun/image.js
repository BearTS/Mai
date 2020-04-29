const { default : { prefix } } = require('../../settings.json')
const { image } = require('nekos-image-api')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const Danbooru =  require('danbooru')
const danbooru = new Danbooru()

module.exports.run = async (client, message, [ category ]) => {

  if (!category) return message.channel.send(error(`Please include which category to search for.`))

  if (category.toLowerCase() === 'categories') return message.channel.send("`bird`,`cat`,`dog`,`lizard`,`booette`,`kaede`,`mai`,`moe`,`emilia`,`kanna`,`rem`,`booru`")

  category = category.toLowerCase()

  let action = null
  let index = null
  const sites = ['https://some-random-api.ml/img/birb',"https://api.thecatapi.com/v1/images/search","https://some-random-api.ml/img/dog","https://nekos.life/api/lizard"]
  const subreddits = ['Booette','Kaede','OneTrueMai','awwnime']

  if ([`bird`,`cat`,`dog`,`lizard`].includes(category)) {
    action = 'fetch'
    index = [`bird`,`cat`,`dog`,`lizard`].indexOf(category)
  }

  if ([`booette`,`kaede`,`mai`,`moe`].includes(category)) {
    action = 'reddit'
    index = [`booette`,`kaede`,`mai`,`moe`].indexOf(category)
  }

  if ([`emilia`,`kanna`,`rem`].includes(category)) action = 'nekos'

  if (category === 'booru') action = 'booru'

  if (action === 'fetch') {

    let data = await fetch(sites[index]).then(res => res.json()).catch(()=>{})

    if (!data) return message.channel.send(error(`Oops! I can't fetch image from ${sites[index]}`))

    link = data.hasOwnProperty('link') ? data.link : typeof data === 'object' && category === 'cat' ? data[0].url : data.url

    return message.channel.send(new MessageEmbed().setAuthor(category, null, link).setColor('GREY').setImage(link))

  } else if ( action == 'reddit') {

    let data = await fetch(`https://reddit.com/r/${subreddits[index]}.json`).then(res => res.json()).catch(()=>{})

    if (!data) return message.channel.send(error(`Oops! I can't fetch image from https://reddit.com/r/${subreddits[index]}`))

    const { data : { children } } = data

    const res = children.filter( m => m.data.post_hint === 'image' && m.data.over_18 === false)

    const { data : { title, url} } = res[Math.floor(Math.random()*(res.length-1))]

    return message.channel.send(new MessageEmbed().setAuthor(category, null, url).setColor('GREY').setImage(url).setFooter(title))

  } else if (action === 'nekos') {

    const data = await image[category]()

    if (!data) return message.channel.send(error(`Oops! I can't fetch image from https://nekos-life.moe`))

    const { url } = data

    return message.channel.send(new MessageEmbed().setAuthor(category, null, url).setColor('GREY').setImage(url))

  } else {

    const data = await danbooru.posts( { tags: `rating:safe`, limit: 200 } ).catch(()=>{})

    if (!data) return message.channel.send(error(`Oops! I can't fetch image from https://danbooru.donmai.us`))

    const { large_file_url } = data[Math.floor(Math.random() * (data.length-1))]

    return message.channel.send(new MessageEmbed().setAuthor(category, null, large_file_url).setColor('GREY').setImage(large_file_url))

  }

}


module.exports.config = {
  name: "image",
  aliases: ['im','img','pic','pics','picture','photo'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "fun",
  description: `Generate a random image from selected categories. Type \`${prefix}img categories\` to return all the available categories for this command.` ,
  examples: ['im cat','image emilia'],
  parameters: []
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
