const MAL = require('mal-scraper')
const {RichEmbed} = require('discord.js')
const settings = require('./../../botconfig.json')
const utility = require('./../../utils/majUtils.js')


module.exports.run = (bot,message,args) => {

  if (args.length === 0) return message.channel.send('Error: Please include a query to search with.').then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})

  let query = args.join(' ')
  MAL.getInfoFromName(query).then(data => {
    if (!data) return message.channel.send(`No anime found for **${query}**`).then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})
    let genres;
    let producers;
    let studios;
    if (!data.genres) {
      genres = "No Information"
    } else {
        genres = []
      for (var i=0;i<data.genres.length;i++){
        genres.push(data.genres[i])
      }
      genres = genres.join(", ") + "."
    }
    if (!data.producers){
      producers = "No Information"
    } else {
      producers = []
      for (var i=0;i<data.producers.length;i++){
        producers.push(data.producers[i])
      }
      producers = producers.join(", ") + "."
    }
    if (!data.studios) {
      studios = "No Information"
    } else {
      studios = []
      for (var i=0;i<data.studios.length;i++){
        studios.push(data.studios[i])
      }
      studios = studios.join(', ') + "."
    }
    const title = (data.title) ? data.title : "No Information"
    const url = (data.url) ? data.url : false
    const desc = (data.englishTitle) ? data.englishTitle : "No Information";
    const image = (data.picture) ? data.picture : false;
    const syn = (data.synopsis) ? data.synopsis : "No Information";
    const type = (data.type.length > 0) ? data.type : "No Information";
    const aired = (data.aired.length > 0) ? data.aired : "No Information";
    const status = (data.status.length > 0) ? data.status : "No Information";
    const episodes = (data.episodes.length > 0) ? data.episodes : "No Information";
    const premiered = (data.premiered.length > 0) ? data.premiered : "No Information";
    const source = (data.source.length > 0) ? data.source : "No Information";
    const rating = (data.rating.length > 0) ? data.rating : "No Information";
    const scoring = data.score + " " + data.scoreStats;
    const score = ((data.score.length > 0) && (data.scoreStats.length > 0)) ? scoring : "No Information";

    const embed = new RichEmbed()
    .setColor(settings.colors.embedDefault)
    .setAuthor(`Top Match for ${query}`)
    .setTitle(title)
    .setDescription(desc)
    .addField("Synopsis", utility.textTrunctuate(syn,1000))
    .addField("Type",type,true)
    .addField("Aired",aired,true)
    .addField("Status",status,true)
    .addField("Episodes",episodes,true)
    .addField("Premiered",premiered,true)
    .addField("Rating",rating,true)
    .addField("Producers",producers,true)
    .addField("Studios",studios,true)
    .addField("Source",source,true)
    .addField("Genre",genres,true)
    .addField("Score",scoring,true)
    .setTimestamp()


    if (image) {
      embed.setImage(image)
    } else {
      embed.addField("Notes", "No Image found for this Anime")
    }

    if (url) {
      embed.setURL(url)
    }

    return new Promise( async (resolve, reject) => {
      const sent = await message.channel.send(embed)
      let reactions = ['👍', '👎', '😂', '😮', '😡', '❌'];
      for (let i = 0; i < reactions.length; i++) await sent.react(reactions[i]);
    })

  })

}

module.exports.help = {
  name: "anime",
  aliases: ['ani','as'],
	group: 'anime',
	description: 'Searches for a specific anime in MyAnimeList.net',
	examples: ['anime aobuta','ani seishun buta yarou','as bunnygirl senpai'],
	parameters: ['search query']
}
