const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const { toRomaji } = require('wanakana')

module.exports.run = async (client, message, args) => {

  if (!args.length) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('Please provide me a word to get the definition of'))

  const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURI(args.join(' '))}`).then(res => res.json()).catch(()=>{})

  if (!res) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('The JishoAPI did not respond. Please report this to the bot owner. The API might be down or there might be changes on the API itself.'))

  if (!res.data.length) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`\u200B\n\nNo results found for **${args.join(' ')}**!`).setThumbnail('https://jisho.org/images/logo_static.png') )

  const jisho = res.data[0]

  message.channel.send( new MessageEmbed()
    .setAuthor(jisho.slug)
    .setDescription(`${jisho.is_common ? `Common Word` : `Uncommon Word`} | [External Link](https://jisho.org/search${encodeURI(args.join(' '))})`)
    .addField(`Definition`, JSON.stringify(jisho.senses[0].english_definitions).replace(/\"/g, '').replace(/,/g, '\n'))
    .addField(`Reading`,`• **Kana**: ${jisho.japanese[0].reading ? jisho.japanese[0].reading : 'N/A'}\n• **Romaji**: ${toRomaji(jisho.japanese[0].reading)}`)
    .setFooter(`${jisho.senses[0].see_also[0] ? `See Also: ${jisho.senses[0].see_also[0]}` : '' }`)
    .setThumbnail('https://jisho.org/images/logo_static.png')
    .setColor('GREY')
  )
}

module.exports.config = {
  name: "jisho",
  aliases: ['japanese','kanji','nipponify'],
  cooldown:{
    time: 10,
    msg: "Accessing Jisho has been rate limited to 1 use per user per 10 seconds"
  },
  group: "utility",
  description: "Searches for Japanese words and Kanji on Jisho!",
  examples: ["jisho [word <kanji, katakana, hiragana, romaji>]"],
  parameters: ['word']
}
