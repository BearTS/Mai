const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const { toRomaji } = require('wanakana')

module.exports = {
  name: 'jisho',
  aliases: ['weebify', 'kanji', 'nipponify'],
  guildOnly: true,
  cooldown: {
    time: 10000,
    message: "Accessing Jisho has been rate limited to 1 use per user per 10 seconds"
  },
  group: 'utility',
  description:"Searches for Japanese words and Kanji on Jisho!",
  examples: ["jisho [word <kanji, katakana, hiragana, romaji>]"],
  parameters: ['word'],
  run: async (client, message, [ query ]) => {

    if (!query) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please provide me a word to get the definition of.`)

    const res = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURI(query)}`).then(res => res.json()).catch(()=> null)

      if (!res || res.meta && res.meta.status !== 200)
        return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Could not connect to JISHO.`)

      if (!res.data || !res.data.length)
        return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, No results were found for your query: **${query}**.`)

      let fields = []

      for ( const { slug, is_common, tags, japanese, senses } of res.data.filter( d => d.attribution.jmdict ).splice(0,3)) {
        fields.push({
          name: '\u200b',
          value: `**${slug}** - ${is_common ? `Common Word` : `Uncommon Word`}\n**Kanji**: ${japanese.map( m => `${m.word ? `"${m.word}"` : ''} ${m.reading ? `*"(${m.reading})"*`:''}`).join(' • ')}\n**Romanized**: ${japanese.map( m => toRomaji(m.reading)).join(' • ')}\n**Definition**: ${senses[0].english_definitions}\n\n${senses[0].restrictions.length ? `\n**Restrictions**: ${senses[0].restrictions.join('\n')}**`:''}${senses[0].tags.length || senses[0].info.length ? `\n**Notes**:  ${senses[0].tags.join(' • ')}${senses[0].info.length ? ' • ' : ''}${senses[0].info.join(' • ')}` : ''}${senses[0].see_also.length ? `\n\n**See Also**: ${senses[0].see_also.join('\n')}` : ''}`,
          inline: true
        })
      }

      return message.channel.send( new MessageEmbed()
        .setAuthor(`🇯🇵 • Search Results for ${query}!`)
        .addFields(fields)
        .addField('\u200b',`[External Link](https://jisho.org/search/${query} 'https://jisho.org/search/${query}')`)
        .setColor('GREY')
        .setFooter(`🇯🇵 • Jisho.org`)
    )
  }
}
