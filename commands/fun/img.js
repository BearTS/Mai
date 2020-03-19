const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
let api = require('nekos-image-api');
const fetch = require('node-fetch')


module.exports.run = (bot, message, args) => {

  if (args.length<1) return message.channel.send('Please include which to search image for.')

  if (args[0] === 'categories') return message.channel.send("`bird`,`cat`,`dog`,`lizard`,`booette`,`kaede`,`mai`,`moe`,`emilia`,`kanna`,`rem`,`booru`")

  const fetcher = [
    {
      names: ["bird","birds","birb","burb","birbo","tweet"],
      url: "http://random.birb.pw/tweet",
    },
    {
      names:["cat","cats","purr","meow"],
      url:"https://api.thecatapi.com/v1/images/search",
    },
    {
      names:["dog","dogs","woof","barf","doggo","pupper"],
      url:"https://random.dog/woof.json"
    },
    {
      names:["lizard","liz","lilreptile"],
      url: "https://nekos.life/api/lizard"
    }
  ]
  const randomPuppyImages = [
    {
      words: ['boette','booette'],
      searcher: 'Booette'
    },
    {
      words: ['kaede','kaede-chan','kaede azusagawa','best imouto'],
      searcher: 'Kaede'
    },
    {
      words: ['mai','mai sakurajima','sakurajima mai','mai-san'],
      searcher: 'OneTrueMai'
    },
    {
      words: ['moe','moe moe kyun','awwnime','moenime'],
      searcher: 'awwnime'
    }
  ]
  const api_images = [
    {
      queries: ["emilia"],
      title: 'Emilia',
      origin: 'Re:Zero | Starting Life from Another World',
      function: api.image.emilia()
    },
    {
      queries: ["kanna"],
      title: 'Kanna',
      origin: 'Maid-dragon | Kobayashi-san chi no Maid Dragon',
      function: api.image.kanna()
    },
    {
      queries: ['rem'],
      title: 'Rem',
      origin: 'Re:Zero | Starting Life from Another World',
      function: api.image.rem()
    }
  ]

      let embed;
      let fetchedURL = fetcher.find(m=>m.names.includes(args.join(" ")))
      let puppies = randomPuppyImages.find(m=>m.words.includes(args.join(" ")))
      let apis = api_images.find(m=>m.queries.includes(args.join(' ')))
    if (fetchedURL){
          if (fetchedURL.names.includes("bird")){
            fetch(fetchedURL.url).then(res=>res.text()).then(json=>{
              embed = new RichEmbed()
              .setImage(`http://random.birb.pw/img/${json}`)
              .setFooter('http://random.birb.pw/ ©', 'http://random.birb.pw/img/BPVpe.jpg')
              .setColor(settings.colors.embedDefault)
              return message.channel.send(embed).catch(()=>{
                message.channel.send(`APIError: Cannot connect to server.`)
              })
            })
          } else if (fetchedURL.names.includes("cat")){
            fetch(fetchedURL.url).then(res=>res.json()).then(json=>{
              embed = new RichEmbed()
              .setImage(json[0].url)
              .setColor(settings.colors.embedDefault)
              return message.channel.send(embed).catch(()=>{
                message.channel.send(`APIError: Cannot connect to server.`)
              })
            })
          } else if (fetchedURL.names.includes("dog")){
            fetch(fetchedURL.url).then(res=>res.json()).then(json=>{
              embed = new RichEmbed()
              .setImage(json.url)
              .setColor(settings.colors.embedDefault)
              return message.channel.send(embed).catch(()=>{
                message.channel.send(`APIError: Cannot connect to server.`)
              })
            })
          } else if (fetchedURL.names.includes("lizard")){
            fetch(fetchedURL.url).then(res=>res.json()).then(json=>{
              embed = new RichEmbed()
              .setImage(json.url)
              .setColor(settings.colors.embedDefault)
              return message.channel.send(embed).catch(()=>{
                message.channel.send(`APIError: Cannot connect to server.`)
              })
            })
          } else embed = `Sorry, my API is not working`
    } else if (puppies){
      const randomPuppy = require('random-puppy')
      randomPuppy(puppies.searcher).then((url) => {
         embed = new RichEmbed()
        .setFooter(`${puppies.searcher} |`)
        .setDescription(`[${puppies.searcher}](${url})`)
        .setImage(url)
        .setColor(settings.colors.embedDefault)
        return message.channel.send(embed).catch(()=>{
          message.channel.send(`APIError: Cannot connect to server.`)
        })
      }).catch(()=>{
        embed = `Sorry, my API is not working!`
      })
    } else if (args.join(' ')==='booru'){
      const Danbooru = require('danbooru')
      const booru = new Danbooru()
      const utilities = require('./majUtils.js')
      booru.posts({tags: `rating:safe`}).then((data)=>{
        const post = data[Math.floor(Math.random()*(data.length-1))]
        embed = new RichEmbed()
        .setColor(settings.colors.embedDefault)
        .setImage(post.file_url)
        if (post.tag_string_general.length>0) embed.setDescription(`Tags: ${utilities.textTrunctuate(post.tag_string_general.length),150}`)
        return message.channel.send(embed).catch(()=>{
          message.channel.send(`APIError. Cannot connect to server.`)
        })
      }).catch(()=>{
        message.channel.send(`Sorry, BooruAPI is down.`)
      })
    } else if (apis){
      apis.function.then(res=>{
        embed = new RichEmbed()
        .setAuthor(`${apis.title}`)
        .setImage(res.url)
        .setColor(settings.colors.embedDefault)
        .setFooter(`${apis.origin} | ${apis.title}`)
        return message.channel.send(embed).catch(()=>{
          message.channel.send(`APIError. Cannot connect to server.`)
        })
      }).catch((err)=>{
        message.channel.send(`Sorry, Nekos-image-api is down.`)
      })
    } else return message.channel.send(`Sorry, I can't seem to find an image of a **${args.join(' ')}**`)

  }

  module.exports.help = {
    name: "img",
    aliases:["image","pic","pics","picture","photo"],
  	group: 'fun',
  	description: 'Generate a random image from selected categories. Type `img categories` to return all the available categories for this command.',
  	examples: ['image cat','pic emilia'],
  	parameters: ['category']
  }
