const {RichEmbed} = require('discord.js')
const animeQuotes = require('animequotes')
const KITSU = require('node-kitsu')
const settings = require('./../../botconfig.json')

module.exports.run = (bot,message,args) => {

  let quote;
  let errors = [];

  if (args.length>0){
    if (args[0] === 'anime'){
      if (args.length === 1){
       quote = animeQuotes.randomQuote();
       errors.push('No Search Query. Redirecting to Randomquotes Instead.')
      } else
      args.shift()
      quote = animeQuotes.getQuotesByAnime(args.join(' '))
    } else if (args[0] === 'char' || args[0] === 'character'){
      if (args.length === 1){
        quote = animeQuotes.randomQuote();
        errors.push('No Search Query. Redirecting to Randomquotes Instead.')
      } else
      args.shift()
      quote = animeQuotes.getQuotesByCharacter(args.join(' '))
    } else {
      quote = animeQuotes.randomQuote();
       errors.push(`**${args[0]}** is not a valid category. Redirecting to Randomquotes Instead.`)
    }
  } else quote = animeQuotes.randomQuote();


if (quote.Error) {
  quote = animeQuotes.randomQuote();
  errors.push(`No quote found for ${args.join(' ')}`)
}

if (quote.length>1){
  quote = quote[Math.floor(Math.random()*(quote.length-1))]
}

  KITSU.searchAnime(quote.anime,0).then(results => {
    const embed = new RichEmbed()
    .setColor(settings.colors.embedDefault)
    .addField(`Quoted from ${quote.anime}`,`${quote.quote}\n\n-*${quote.name}*`)
    .setFooter(`RandomAnimeQuotes || Kitsu.io`)
    .setTimestamp()

    if (errors.length>0) {
      message.channel.send(errors.join("\n")).then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})
    }

    if (!results){

    } else if (!results[0].attributes){

    } else if (!results[0].attributes.coverImage){

    } else if (!results[0].attributes.coverImage.original){

    } else embed.setImage(results[0].attributes.coverImage.original)


    return new Promise( async (resolve, reject) => {
      const sent = await message.channel.send(embed)
      let reactions = ['👍', '👎', '😂', '😮', '😡', '❌'];
      for (let i = 0; i < reactions.length; i++) await sent.react(reactions[i]);
    })
  })


}

module.exports.help = {
  name: 'aniquote',
  aliases: ['aq','animequotes','aniquote','quotes'],
	group: 'anime',
	description: 'Generate a random anime quote',
	examples: ['aniquote anime one piece','aq character naruto','aq'],
	parameters: ['category','search query']
}
